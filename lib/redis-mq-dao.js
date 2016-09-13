/**
 * Created by behnamhajian on 2016-08-30.
 */

var RedisSMQ = require('rsmq');
var RSMQWorker = require('rsmq-worker');

exports.createConnection = function(options){
  return new RedisSMQ({host: options.address, port: options.port, ns: 'rsmq'});
};

exports.createWorker = function (queueName, options) {
  var worker = new RSMQWorker(queueName, {rsmq: options.connection});
  return worker;
}
