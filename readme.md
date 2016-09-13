# wsmq

Websocket is an easy, reliable, fast growing technology to implement bi-directional communication between end points.
However, there are cases which websocket doesn't work. For example when you need an end to end communication
between two application and those applications are running in a highly available cluster/cloud. In a highly
available server where a websocket is used, we would need a message queue as another layer behind the websocket
server to deliver the message to the right server which is connected to the destination client.

[![ws-mq model](https://github.com/bhajian/wsmq/blob/master/MQ.png)]

Message queue protocols are also another way of end to end communication between 2 or more nodes.
Most of message queue implementations are not easily pluggable with the user applications.
For example custom authentication are not easy to do with message queue implementations.
WSMQ is a simple interface between Redis-MQ and websocket. The subscribers are connecting to the server
with a websocket and the WSMQ server which subscribes to redis with an MQ pattern pulls the messages
on a server to which client is connected with a websocket and sends the message with a websocket to
the corresponding client.

## websocketmq Usage

```
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

```
