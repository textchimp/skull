// Websockets server command:
// node js/server.js INCOMING_PORT OUTGOING_PORT (57121 4559)

var app = app || {};

if( (typeof app.oscHandler) !== "function" ){
  app.oscHandler = function(){};
}

var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true
});

oscPort.open();

oscPort.on("ready", function () {
  oscPort.on("message", function (oscMsg) {
    // console.log("An OSC message just arrived!", oscMsg );
    app.oscHandler(oscMsg.address, oscMsg.args);
    // if( oscMsg.address === "/step" ){
    //   // console.log('next');
    //   sequencer.stepper.value = oscMsg.args[0].value - 1;
    //   sequencer.next();
    // }
  });
});
