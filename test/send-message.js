/**
 * Created by behnamhajian on 2016-09-12.
 */
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

