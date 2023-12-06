// Server
var net = require("net");
var mqttCon = require("mqtt-connection");
var server = new net.Server();

server.on("connection", function(stream) {
    var client = mqttCon(stream);
    console.log("connection");
    // client connected
    client.on("connect", function(packet) {
        console.log("connect: " + packet);
        console.log(client.options);
        // acknowledge the connect packet
        client.connack({ returnCode: 0 });
    });

    // client published
    client.on("publish", function(packet) {
        // send a puback with messageId (for QoS > 0)
        client.puback({ messageId: packet.messageId });
        console.log("publish :" + packet);
    });

    // client pinged
    client.on("pingreq", function() {
        // send a pingresp
        client.pingresp();
        console.log("pingreq");
    });

    // client subscribed
    client.on("subscribe", function(packet) {
        // send a suback with messageId and granted QoS level
        client.suback({ granted: [packet.qos], messageId: packet.messageId });
        console.log("subscribe: " + packet);
    });

    // connection error handling
    client.on("close", function() {
        client.destroy();
        console.log("close");
    });
    client.on("error", function() {
        client.destroy();
        console.log("error");
    });
    client.on("disconnect", function() {
        client.destroy();
        console.log("disconnect");
    });

    // timeout idle streams after 60 minutes
    stream.setTimeout(1000 * 60 * 60);
    // stream timeout
    stream.on("timeout", function() {
        client.publish({
            retain: false,
            qos: 2,
            dup: false,
            length: 14,
            topic: "hello",
            payload: "world",
            messageId: 1
        });
        console.log("timeout");
        client.destroy();
    });
});

// listen on port 1883
server.listen(1883);
