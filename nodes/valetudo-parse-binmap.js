const RRMapParser = require("../lib/RRMapParser");
const zlib = require("zlib");

module.exports = function(RED) {
    function ValetudoParseBinmapNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on("input", function(msg) {
            var mapData = msg.payload;
            new Promise((resolve,reject) => {
                zlib.gunzip(mapData, (err, data) => {
                    if (!err) {
                        resolve(RRMapParser.PARSE(data));
                    } else {
                        reject(err);
                    }
                });         
            }).then(parsedMapData => {
                msg.payload = JSON.stringify(parsedMapData);
                node.send(msg);
            }).catch(err => node.error(err, msg));
        });
    }
    RED.nodes.registerType("valetudo-parse-binmap",ValetudoParseBinmapNode);    
};
