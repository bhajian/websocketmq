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

To start a websocketmq server follow the following instructions:

### creating user model to be used by tokens2
1st: create a model in user.js:

```
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({
  userName: String,
  password: String,
  accessToken: String,
}));

```
tokens2 is a reliable authentication/verification module that works based on json
web token with a short TTL and uses user model for persistence of an access token for the tokens which are being invalidated.
you can also use any other verification module instead of tokens2.

### websocketMQ initialization

```
var websocketMq = require('../lib/websocket-mq');
var http = require('http');
var express = require('express');
var verify = require('tokens2').verification.verify;
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDB');
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

### websocket client configucations

Your websocket client has to subscribe to a specific channel by sending `/subscribe/57c8ffa6d133a25447d8883c'` to the server:

```
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3000/', {
  headers: {
    'x-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2Vycy81N2M4ZmZhNmQxMzNhMjU0NDdkODg4M2MiLCJpYXQiOjE0NzM0NDk0MTYsImV4cCI6MTQ3MzQ1MDMxNn0.YEWSG_yvXsgzLnv2Asmk6SO10SHAwl6odBYCMBHQR1cA',
    'x-access-token': '3c4e13e04fe931e52263dc3c0ecb704012399d7ffea9ec80bd2c0ce9a1622b3a6ca241f874acdf386bf3693a7c0ecafb2b9ec87b4ab72285d39f2866711d4245b7732f0832936d6066e8af04f6eafae6cc8a',
}});

ws.on('open', function open() {
  ws.send('/subscribe/57c8ffa6d133a25447d8883c');
  setTimeout(function timeout() {
    ws.send(Date.now().toString(), {mask: true});
  }, 1000);
});

ws.on('message', function(data, flags) {
  console.log(data);
});

ws.on('close', function close() {
  console.log('disconnected');
});
```

### rsmq publisher

Now the publisher has to publish some message to the message queue 57c8ffa6d133a25447d8883c :

```
    var redisMQ = require('../lib/redis-mq-dao');
    var rsmqConnection = redisMQ.createConnection({
      redisAddress: '127.0.0.1',
      redisPort: '6379',
    });


    rsmqConnection.sendMessage({qname: '57c8ffa6d133a25447d8883c', message: 'hello world'},
      function (err, resp) {
        if (resp) {
          console.log("Message sent. ID:", resp);
        }
      });
```

Which will be received in the websocket client.
