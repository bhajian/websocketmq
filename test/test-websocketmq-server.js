/**
 * Created by behnamhajian on 2016-09-13.
 */

var websocketMq = require('../lib/websocket-mq');
var http = require('http');
var express = require('express');
var verify = require('tokens2').verification.verify;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tincognito');
var UserModel = require('./user');
var port = '3000';
var app = express();
app.set('port', port);
var server = http.createServer(app);
var verifyMe = verify({
  userModel: UserModel,
  secret: 'superSecret',
  expiresIn: '15m',
  cryptoAlgorithm: 'aes-256-ctr'});

websocketMq.websocketMQServer({
  server: server,
  redisAddress: '127.0.0.1',
  redisPort: '6379',
  verify: verifyMe,
  secret: 'superSecret',
  cryptoAlgorithm: 'aes-256-ctr'
}, function(){

});

server.listen(port);
