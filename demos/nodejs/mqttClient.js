console.log("MQTT Client...");

// MQTT Client
const mqtt = require("mqtt");
const client = mqtt.connect("http://rasp-pi-sw:1883");
// const client = mqtt.connect("http://192.168.31.100:16883");

client.on("connect", function() {
    console.log("connected");
    client.subscribe("openhab/#", function(err) {
        // client.subscribe("openhab/statdev/gateway/001/", function(err) {
        console.log("subscribe");
        if (!err) {
            console.log("subscribe success");
            // client.publish("openhab/statdev/gateway/001/color", "60,8,4");
            // client.publish("openhab/todev/gateway/001/color", "0,0,0");
            client.publish("openhab/todev/welcomehome/airpurifier", "ON");
        }
    });
});

client.on("message", function(topic, message) {
    console.log("message: " + topic + " " + message.toString());
});
client.on("error", function(err) {
    console.log("error: " + err);
    client.end();
});

// module.exports = client;
