# wsmq

Websocket is an easy, reliable, fast growing technology to implement bi-directional communication between end points.
However, there are cases which websocket doesn't work. For example when you need an end to end communication
between two application and those applications are running in a highly available cluster/cloud. In a highly
available server where a websocket is used, we would need a message queue as another layer behind the websocket
server to deliver the message to the right server which is connected to the destination client.

[![authenticate(https://github.com/bhajian/wsmq/blob/master/MQ.png)]

Message queue protocols are also another way of end to end communication between 2 or more nodes.
Most of message queue implementations are not easily pluggable with the user applications.
For example custom authentication are not easy to do with message queue implementations.
WSMQ is a simple interface between Redis-MQ and websocket. The subscribers are connecting to the server
with a websocket and the WSMQ server which subscribes to redis with an MQ pattern pulls the messages
on a server to which client is connected with a websocket and sends the message with a websocket to
the corresponding client.


