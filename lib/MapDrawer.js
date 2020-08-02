const path = require("path");
const Jimp = require("jimp");

const chargerImagePath = path.join(__dirname, "../assets/img/charger.png");
const robotImagePath = path.join(__dirname, "../assets/img/robot.png");

class MapDrawer {
    /**
     *
     * @param {object} mapData
     * @param {object} settings
     * @param {number=} settings.scale
     * @param {boolean=} settings.drawPath
     * @param {boolean=} settings.drawCharger
     * @param {boolean=} settings.drawRobot
     * @param {number=} settings.crop_x1
     * @param {number=} settings.crop_x2
     * @param {number=} settings.crop_y1
     * @param {number=} settings.crop_y2
     */
    constructor(mapData, settings) {
        this.mapData = mapData;

        this.settings = Object.assign({
            drawPath: true,
            drawCharger: true,
            drawRobot: true,
            scale: 4,
            crop_x1: 0,
            crop_x2: Number.MAX_VALUE,
            crop_y1: 0,
            crop_y2: Number.MAX_VALUE
        }, settings);

        this.freeColor = Jimp.cssColorToHex("#0076FF");
        this.occupiedColor = Jimp.cssColorToHex("#333333");
        this.segmentColors = [
            Jimp.cssColorToHex("#19A1A1"),
            Jimp.cssColorToHex("#7AC037"),
            Jimp.cssColorToHex("#DF5618"),
            Jimp.cssColorToHex("#F7C841")
        ];
        this.pathColor = Jimp.cssColorToHex("#FFFFFF");
    }

    async drawPng() {
        await this.drawJimp();
        return await this.image.getBufferAsync("image/png");
    }

    async drawJimp() {
        this.allLayerDimensions = {
            x: {min: null, max: null},
            y: {min: null, max: null}
        };

        /** @type {number} */
        this.pixelSize = this.mapData.pixelSize;

        this.image = await Jimp.create(this.mapData.size.x / this.mapData.pixelSize, this.mapData.size.y / this.mapData.pixelSize);

        this.drawLayers(this.mapData.layers);

        this.image.scale(this.settings.scale, Jimp.RESIZE_NEAREST_NEIGHBOR);

        if(this.settings.drawCharger) {
            const path = this.mapData.entities.find(e => e.type === "path");
            path.points = this.mapPointsToScale(path.points);
            this.drawPath(path);
        }

        if(this.settings.drawCharger) {
            const charger_location = this.mapData.entities.find(e => e.type === "charger_location");
            charger_location.points = this.mapPointsToScale(charger_location.points);
            this.drawEntity(charger_location, await Jimp.read(chargerImagePath));
        }

        if(this.settings.drawRobot) {
            const robot_position = this.mapData.entities.find(e => e.type === "robot_position");
            robot_position.points = this.mapPointsToScale(robot_position.points);
            this.drawEntity(robot_position, await Jimp.read(robotImagePath));
        }

        this.cropToLayerDimensions();

        this.cropBySettings();

        return this.image;
    }

    /**
     * @private
     */
    drawLayers(layers) {
        if (layers && layers.length > 0) {
            layers.forEach(layer => {
                this.drawLayer(layer);
            });
        }
    }

    /**
     * @private
     */
    drawLayer(layer) {
        let color = this.getLayerColor(layer);

        this.processLayerDimensions(this.allLayerDimensions.x, layer.dimensions.x);
        this.processLayerDimensions(this.allLayerDimensions.y, layer.dimensions.y);

        for (let i = 0; i < layer.pixels.length; i = i + 2) {
            this.image.setPixelColor(color, layer.pixels[i], layer.pixels[i+1]);
        }
    }

    /**
     * @private
     */
    getLayerColor(layer) {
        switch (layer.type) {
            case "floor":
                return this.freeColor;
            case "wall":
                return this.occupiedColor;
            case "segment":
                return this.segmentColors[((layer.metaData.segmentId - 1) % this.segmentColors.length)];
            default:
                console.error("Missing color for " + layer.type);
                return Jimp.cssColorToHex("#000000");
        }
    }

    /**
     * @private
     */
    processLayerDimensions(allLayerDimensions, layerDimensions) {
        if(allLayerDimensions.min === null || allLayerDimensions.min > layerDimensions.min) {
            allLayerDimensions.min = layerDimensions.min;
        }
        if(allLayerDimensions.max === null || allLayerDimensions.max < layerDimensions.max) {
            allLayerDimensions.max = layerDimensions.max;
        }
    }

    /**
     * @private
     */
    drawPath(path) {
        for (let i = 0; i < path.points.length; i = i + 2) {
            this.drawLine(this.pathColor, path.points[i], path.points[i+1], path.points[i+2], path.points[i+3]);
        }
    }

    /**
     * @private
     */
    drawLine(color, x1, y1, x2, y2) {
        let dx = (x2 - x1);
        let dy = (y2 - y1);
        let steps = Math.max(Math.abs(dx), Math.abs(dy));

        for (let i = 1; i <= steps; i++) {
            this.image.setPixelColor(color, x1, y1);
            x1 = x1 + dx / steps;
            y1 = y1 + dy / steps;
        }
    }

    /**
     * @private
     */
    drawEntity(location, sprite) {
        if(location.metaData.angle) {
            sprite.rotate(-1 * location.metaData.angle);
        }

        this.image.composite(
            sprite,
            location.points[0] - sprite.bitmap.width / 2,
            location.points[1] - sprite.bitmap.height / 2
        );
    }

    /**
     * @private
     */
    cropToLayerDimensions() {
        this.image.crop(
            this.allLayerDimensions.x.min * this.settings.scale,
            this.allLayerDimensions.y.min * this.settings.scale,
            (this.allLayerDimensions.x.max - this.allLayerDimensions.x.min + 1) * this.settings.scale,
            (this.allLayerDimensions.y.max - this.allLayerDimensions.y.min + 1) * this.settings.scale
        );
    }

    /**
     * @private
     */
    cropBySettings() {
        const BOUNDS = {
            x1: Math.min(this.settings.crop_x1, this.image.bitmap.width-1),
            x2: Math.min(this.settings.crop_x2, this.image.bitmap.width),
            y1: Math.min(this.settings.crop_y1, this.image.bitmap.height-1),
            y2: Math.min(this.settings.crop_y2, this.image.bitmap.height),
        };

        this.image.crop(
            BOUNDS.x1,
            BOUNDS.y1,
            BOUNDS.x2 - BOUNDS.x1,
            BOUNDS.y2 - BOUNDS.y1
        );
    }

    /**
     * @private
     * @param {number[]} points
     */
    mapPointsToScale(points) {
        return points.map(c => c * this.settings.scale / this.pixelSize);
    }
}

module.exports = MapDrawer;
