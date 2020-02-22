/// <reference types="@types/mocha" />
const fs =  require("fs").promises;
const helper = require("./TestHelper");
const parseBinNode = require("../nodes/valetudo-parse-binmap");

describe("valetudo-parse-binmap Node", function () {

    afterEach(async function () {
        helper.unload();
    });

    it("should be loaded", async function () {
        let flow = [{ id: "n1", type: "valetudo-parse-binmap", name: "test name" }];
        await helper.load(parseBinNode, flow);
        let n1 = helper.getNode("n1");

        n1.should.have.property("name", "test name");
    });

    it("should parse binmap from Valetudo RE 0.4.0-RE7.1 with Firmware 1886 correctly", async function() {
        let flow = [
            { id: "n1", type: "valetudo-parse-binmap", wires:[["n2"]] },
            { id: "n2", type: "helper" }
        ];
        await helper.load(parseBinNode, flow);
        let n1 = helper.getNode("n1");
        let n2 = helper.getNode("n2");
        let data = await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.bin");
        let expected = JSON.parse(await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.json", { encoding: "utf-8" }));

        let promise = helper.createTestPromise(n1, n2);
        n1.receive({ payload: data });
        let msg = await promise;

        msg.payload.image.position.should.deepEqual(expected.image.position);
        msg.payload.image.dimensions.should.deepEqual(expected.image.dimensions);
        msg.payload.image.pixels.should.deepEqual(expected.image.pixels);
        msg.payload.path.should.deepEqual(expected.path);
        msg.payload.charger.should.deepEqual(expected.charger);
        msg.payload.robot.should.deepEqual(expected.robot);
        msg.payload.should.deepEqual(expected);
    });
});
