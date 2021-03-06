/// <reference types="@types/mocha" />
const fs =  require("fs").promises;
const zlib = require("zlib");
const helper = require("./TestHelper");
const mapPngNode = require("../nodes/valetudo-map-png");

describe("valetudo-map-png Node", function () {

    afterEach(async function () {
        helper.unload();
    });

    it("should be loaded", async function () {
        var flow = [{ id: "n1", type: "valetudo-map-png", name: "test name" }];
        await helper.load(mapPngNode, flow);
        var n1 = helper.getNode("n1");

        n1.should.have.property("name", "test name");
    });

    describe("Valetudo", async function() {
        it("should draw JSON string from Valetudo 0.4.0 with Firmware 1886 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW1886_0.4.0.json", { encoding: "utf-8" });
            let expectedPng = await fs.readFile("./test/data/FW1886_0.4.0.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw JSON string from Valetudo 0.6.0 with Firmware 2008 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.json", { encoding: "utf-8" });
            let expectedPng = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw deflated JSON string from Valetudo 2021.01.0b0 with Firmware 2008 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.json", { encoding: "utf-8" });
            let deflatedData = zlib.deflateSync(data);
            let expectedPng = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: deflatedData });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw base64 deflated JSON string from Valetudo 2021.01.0b0 with Firmware 2008 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.json", { encoding: "utf-8" });
            let base64DeflatedData = zlib.deflateSync(data).toString("base64");
            let expectedPng = await fs.readFile("./test/data/FW2008_0.6.0_with_segments.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: base64DeflatedData });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });
    });

    describe("Valetudo RE", async function() {
        it("should draw binmap from Valetudo RE 0.4.0-RE7.1 with Firmware 1886 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.bin");
            let expectedPng = await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw JSON string from Valetudo RE 0.4.0-RE7.1 with Firmware 1886 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.json", { encoding: "utf-8" });
            let expectedPng = await fs.readFile("./test/data/FW1886_RE0.4.0-RE7.1.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw binmap from Valetudo RE 0.9.0 with Firmware 2008 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW2008_RE0.9.0.bin");
            let expectedPng = await fs.readFile("./test/data/FW2008_RE0.9.0.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });

        it("should draw JSON string from Valetudo RE 0.9.0 with Firmware 2008 correctly", async function() {
            let flow = [
                { id: "n1", type: "valetudo-map-png", wires:[["n2"]], drawPath: true, drawCharger: true, drawRobot: true, scale: 4 },
                { id: "n2", type: "helper" }
            ];
            await helper.load(mapPngNode, flow);
            let n1 = helper.getNode("n1");
            let n2 = helper.getNode("n2");
            let data = await fs.readFile("./test/data/FW2008_RE0.9.0.json", { encoding: "utf-8" });
            let expectedPng = await fs.readFile("./test/data/FW2008_RE0.9.0.png");

            let promise = helper.createTestPromise(n1, n2);
            n1.receive({ payload: data });
            let msg = await promise;

            msg.payload.should.deepEqual(expectedPng);
        });
    });
});
