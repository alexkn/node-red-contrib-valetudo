/// <reference types="@types/mocha" />
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
});
