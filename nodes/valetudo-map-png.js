const Tools = require("../lib/Tools");

module.exports = function(RED) {
    function ValetudoMapPngNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var lastMapDraw = 0;
        var settings = {
            drawPath: config.drawPath,
            drawCharger: config.drawCharger,
            drawRobot: config.drawRobot
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

        node.on("input", function(msg) {
            const now = new Date();
            if(now - settings.defer > lastMapDraw) {
                lastMapDraw = now;
                var MapData = msg.payload;
                if(typeof MapData === "string") {
                    MapData = JSON.parse(MapData);
                }

                Tools.DRAW_MAP_PNG(
                    {
                        parsedMapData: MapData,
                        settings: settings
                    }, (err, buf) => {
                        if (!err) {
                            msg.payload = buf;
                            node.send(msg);
                        } else {
                            node.error(err, msg);
                        }
                    }
                );
            }
        });
    }
    RED.nodes.registerType("valetudo-map-png",ValetudoMapPngNode);
};
