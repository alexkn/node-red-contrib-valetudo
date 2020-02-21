const Tools = require("../lib/Tools");
const Gunzip = require("../lib/Gunzip");
const RRMapParser = require("../lib/RRMapParser");

module.exports = function(RED) {
    function ValetudoMapPngNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var lastMapDraw = 0;
        var settings = {
            drawPath: config.drawPath,
            drawCharger: config.drawCharger,
            drawRobot: config.drawRobot,
            defer: 2000
        };
        if(parseInt(config.scale)) {
            settings.scale = parseInt(config.scale);
        }
        if(parseInt(config.defer)) {
            settings.defer = parseInt(config.defer);
        }
        if(parseInt(config.cropX1)) {
            settings.crop_x1 = parseInt(config.cropX1);
        }
        if(parseInt(config.cropX2)) {
            settings.crop_x2 = parseInt(config.cropX2);
        }
        if(parseInt(config.cropY1)) {
            settings.crop_y1 = parseInt(config.cropY1);
        }
        if(parseInt(config.cropY2)) {
            settings.crop_y2 = parseInt(config.cropY2);
        }

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

                const now = new Date();
                if(now - settings.defer > lastMapDraw) {
                    lastMapDraw = now;
                    var MapData = msg.payload;
                    if(typeof MapData === "string") {
                        MapData = JSON.parse(MapData);
                    }else if(Buffer.isBuffer(MapData)) {
                        MapData = await Gunzip(MapData);
                        MapData = RRMapParser.PARSE(MapData);
                    }

                    var buf = await DRAW_MAP_PNG(MapData, settings);
                    outputMsg.payload = buf;
                    send(outputMsg);
                    done();
                }
            } catch (e) {
                done(e.message);
            }
        }

        function DRAW_MAP_PNG(MapData, settings) {
            return new Promise((resolve,reject) => {
                Tools.DRAW_MAP_PNG(
                    {
                        parsedMapData: MapData,
                        settings: settings
                    }, (err, buf) => {
                        if (!err) {
                            resolve(buf);
                        } else {
                            reject(err);
                        }
                    }
                );
            });
        }
    }
    RED.nodes.registerType("valetudo-map-png",ValetudoMapPngNode);
};
