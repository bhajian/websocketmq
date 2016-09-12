/**
 * Created by behnamhajian on 2016-08-29.
 */
var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:3000/', {
  headers: {
    'x-token' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2Vycy81N2M4ZmZhNmQxMzNhMjU0NDdkODg4M2MiLCJpYXQiOjE0NzM0NDk0MTYsImV4cCI6MTQ3MzQ1MDMxNn0.YEWSG_yvXsgzLnv2Asmk6SO10SHAwl6odBYCMBHQR1cA',
    'x-access-token': '3c4e13e04fe931e52263dc3c0ecb704012399d7ffea9ec80bd2c0ce9a1622b3a6ca241f874acdf386bf3693a7c0ecafb2b9ec87b4ab72285d39f2866711d4245b7732f0832936d6066e8af04f6eafae6cc8a',
}});

ws.on('open', function open() {
  ws.send(JSON.stringify({userId: '57c8ffa6d133a25447d8883c'}));
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
