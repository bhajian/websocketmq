/**
 * Created by behnamhajian on 2016-08-30.
 */

var RedisSMQ = require('rsmq');
var rsmq = new RedisSMQ({host: '127.0.0.1', port: 6379, ns: 'rsmq'});
var RSMQWorker = require('rsmq-worker');

exports.rsmq = rsmq;



exports.createWorker = function (queueName, optiotns) {
  var worker = new RSMQWorker(queueName, {rsmq: rsmq});
  return worker;
}
