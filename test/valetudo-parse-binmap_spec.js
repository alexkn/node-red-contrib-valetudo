/// <reference types="@types/mocha" />
var helper = require("./TestHelper");
var parseBinNode = require("../nodes/valetudo-parse-binmap");

describe("valetudo-parse-binmap Node", function () {

    afterEach(async function () {
        helper.unload();
    });

    it("should be loaded", async function () {
        var flow = [{ id: "n1", type: "valetudo-parse-binmap", name: "test name" }];
        await helper.load(parseBinNode, flow);

        var n1 = helper.getNode("n1");

        n1.should.have.property("name", "test name");
    });
});
