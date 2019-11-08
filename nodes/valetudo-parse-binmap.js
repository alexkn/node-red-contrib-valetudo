const RRMapParser = require("../lib/RRMapParser");
const Gunzip = require("../lib/Gunzip");

module.exports = function(RED) {
    function ValetudoParseBinmapNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on("input", (msg) => { handleMessage(msg); });

        async function handleMessage(msg) {
            try {     
                var outputMsg = msg;     

                var mapData = msg.payload;
                mapData = await Gunzip(mapData);
                mapData = RRMapParser.PARSE(mapData);
                
                outputMsg.payload = mapData;
                node.send(outputMsg); 
            } catch (e) {
                node.error(e.message, msg);
            }
          
        }
    }
    RED.nodes.registerType("valetudo-parse-binmap",ValetudoParseBinmapNode);    
};
