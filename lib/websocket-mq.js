/**
 * Created by behnamhajian on 2016-08-29.
 */

var ws = require('ws');
var redisMQ = require('./redis-mq-dao');
var cryto = require('../helper/cryptography');
var _ = require('lodash');

var clients = [];
var rsmqConnection;

exports.websocketMQServer = function websocketServer(options, callback){
  rsmqConnection = redisMQ.createConnection({
    address: options.redisAddress,
    port: options.redisPort,
  });
  var verify = options.verify;
  var sockets = new ws.Server({
    server: options.server
  });

  sockets.on('connection', function(client) {
    console.log('Connection.');
    var res = {};
    var headers = client.upgradeReq.headers;
    var req = {headers: headers, body:{}, query: {}};
    // fix it to put the user info in this callback method. e.g. user Id / etc
    verify(req, res, function () {
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
    if(_.startsWith(message, '/subscribe/')){
      var channel = message.substring('/subscribe/'.length, message.length);
      clients[channel] = client;
      client.channelId = channel;
      client.rsmqWorker = redisMQ.createWorker(channel,
        {connection: rsmqConnection});

      rsmqConnection.createQueue({qname: channel}, function (err, resp) {
        if (resp===1) {
          console.log('queue created')
        }
      });

      client.rsmqWorker.on('message', function(message, next, id){
        client.send(JSON.stringify({message: message}));
        console.log('Message id : ' + id);
        console.log(message);
        next(); // remove this
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
    }
  });

  client.on('close', function() {
    if(client.rsmqWorker){
      client.rsmqWorker.stop();
    }
    rsmqConnection.deleteQueue({qname: client.channelId}, function(){
      
    });
    var index = clients.indexOf(client.channelId);
    if(index > 0) {
      clients.splice(index, 1);
    }
  });
};
