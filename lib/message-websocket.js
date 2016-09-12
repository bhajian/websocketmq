/**
 * Created by behnamhajian on 2016-08-29.
 */
var ws = require('ws');
var redisMQ = require('../../dao/redis-mq-dao');
var verify = require('tokens2').verification.verify;
var UserModel = require('../../model/user');
var cryto = require('../helper/cryptography');

var clients = [];

exports.clients = clients;

exports.websocketServer = function websocketServer(options, callback){
  var verifyMe = verify({
    userModel: UserModel,
    secret: 'superSecret',
    expiresIn: '15m',
    cryptoAlgorithm: 'aes-256-ctr'
  });
  var sockets = new ws.Server({
    server: options.server
  });

  sockets.on('connection', function(client) {
    console.log('Connection.');
    var res = {};
    var headers = client.upgradeReq.headers;
    verifyMe({headers: headers, body:{}, query: {}}, res,
      function () { // fix it to put the user info in this callback method. e.g. user Id / etc
        console.log(JSON.stringify(res));
        var accessToken = headers['x-access-token'];
        var decrypteedAccessToken = cryto.decrypt(accessToken,
          options.cryptoAlgorithm, options.secret);
        client.userId = JSON.parse(decrypteedAccessToken)._id;
        acceptMessages(client);
      });
  });

  return callback(clients);
};

function acceptMessages(client){
  client.on('message', function(message) {
    console.log('message from client : ' + message);
  });

  clients[client.userId] = client;
  client.userId = connectionInfo.userId;
  client.rsmqWorker = redisMQ.createWorker(client.userId);

  redisMQ.rsmq.createQueue({qname: client.userId}, function (err, resp) {
    if (resp===1) {
      console.log('queue created')
    }
  });

  client.rsmqWorker.on('message', function(message, next, id){
    client.send(JSON.stringify({message: message}));
    console.log('Message id : ' + id);
    console.log(message);
    next()
  });

  client.rsmqWorker.on('error', function(err, msg){
    console.log('ERROR', err, msg.id );
  });

  client.rsmqWorker.on('exceeded', function(msg){
    console.log('EXCEEDED', msg.id );
  });

  client.rsmqWorker.on('timeout', function(msg){
    console.log('TIMEOUT', msg.id, msg.rc );
  });

  client.rsmqWorker.start();



  client.on('close', function() {
    if(client.rsmqWorker){
      client.rsmqWorker.stop();
    }
    var index = clients.indexOf(client.userId);
    clients.splice(index, 1);

  });
};
