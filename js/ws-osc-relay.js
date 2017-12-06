// REQUIRES: npm install -g osc express ws
var osc = require("osc"),
    express = require("express"),
    WebSocket = require("ws");

// Bind to a UDP socket to listen for incoming OSC events.
var udpPort = new osc.UDPPort({
    // OSC RECEIVE (listening) port
    // i.e. send messages from other OSC-enabled apps to this port

    localAddress: "0.0.0.0",      // MAKE SURE THIS IS SET CORRECTLY
    localPort: process.argv[2] || 57121,

    // OSC SEND (forwarding) port
    // i.e. the browser's websocket port
    remoteAddress: "127.0.0.1",
    remotePort: process.argv[3] || 8081
});

udpPort.on("ready", function () {
    console.log("Listening for OSC over UDP.");
    console.log("OSC Host:", udpPort.options.localAddress + ", Port:", udpPort.options.localPort);
    console.log('WebSockets forwarding to ws://' + udpPort.options.remoteAddress + ':' +  udpPort.options.remotePort);
});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
var appResources = __dirname + "/web",
    app = express(),
    server = app.listen(8081),
    wss = new WebSocket.Server({
        server: server
    });

app.use("/", express.static(appResources));

wss.on("connection", function (socket) {

    console.log("WebSocket connection established.");

    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });

});
