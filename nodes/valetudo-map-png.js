const Tools = require("../lib/Tools");
const Gunzip = require("../lib/Gunzip");
const Inflate = require("../lib/Inflate");
const RRMapParser = require("../lib/RRMapParser");
const MapDrawer = require("../lib/MapDrawer");

module.exports = function(RED) {
    function ValetudoMapPngNode(config) {
        RED.nodes.createNode(this,config);
        let node = this;
        let lastMapDraw = 0;

        let defer = 2000;
        if(parseInt(config.defer)) {
            defer = parseInt(config.defer);
        }

        let settings = {
            drawPath: config.drawPath,
            drawCharger: config.drawCharger,
            drawRobot: config.drawRobot,
            scale: 4
        };
        if(parseInt(config.scale)) {
            settings.scale = parseInt(config.scale);
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
                if(now.getTime() - defer > lastMapDraw) {
                    lastMapDraw = now.getTime();
                    var MapData = msg.payload;

                    if(isBase64(MapData)) {
                        MapData = Buffer.from(MapData, "base64");
                    }

                    if(typeof MapData === "string") {
                        MapData = JSON.parse(MapData);
                    }

                    if(Buffer.isBuffer(MapData)) {
                        try {
                            // Valetudo
                            MapData = await Inflate(MapData);
                            MapData = JSON.parse(MapData);
                        } catch (error) {
                            // Valetudo RE
                            MapData = await Gunzip(MapData);
                            MapData = RRMapParser.PARSE(MapData);
                        }
                    }

                    var buf;
                    if(MapData.__class == "ValetudoMap") {
                        let drawer = new MapDrawer(MapData, settings);
                        buf = await drawer.drawPng();
                    } else {
                        buf = await DRAW_MAP_PNG(MapData, settings);
                    }
                    outputMsg.payload = buf;
                    send(outputMsg);
                    done();
                }
            } catch (e) {
                done(e.message);
            }
        }

        function isBase64(data) {
            return typeof data === "string" && Buffer.from(data, "base64").toString("base64") === data;
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
