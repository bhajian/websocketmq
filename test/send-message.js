/**
 * Created by behnamhajian on 2016-09-12.
 */
var redisMQ = require('../../dao/redis-mq-dao');

var client = messageWS.clients[destinationId];
if (client) {
  redisMQ.rsmq.sendMessage({qname: destinationId, message: body},
    function (err, resp) {
      if (resp) {
        console.log("Message sent. ID:", resp);
      }
    });
}
