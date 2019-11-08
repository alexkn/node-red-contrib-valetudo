const RRMapParser = require("../lib/RRMapParser");
const Gunzip = require("../lib/Gunzip");

module.exports = function(RED) {
    function ValetudoParseBinmapNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on("input", (msg, send, done) => {
            send = send || function() { node.send.apply(node,arguments); }; 
            done = done || function(err) { 
                if(err) {
                    node.error(err, msg);
                }                
            };

            handleMessage(msg, send, done); 
        });

        async function handleMessage(msg, send, done) {
            try {     
                var outputMsg = msg;     

                var mapData = msg.payload;
                mapData = await Gunzip(mapData);
                mapData = RRMapParser.PARSE(mapData);
                
                outputMsg.payload = mapData;
                send(outputMsg); 
                done();
            } catch (e) {
                done(e.message);
            }
          
        }
    }
    RED.nodes.registerType("valetudo-parse-binmap",ValetudoParseBinmapNode);    
};
