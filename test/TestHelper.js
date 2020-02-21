const NodeTestHelper = require("node-red-node-test-helper");

class Helper extends NodeTestHelper.NodeTestHelper {
    /**
     * @param {*} testNode
     * @param {*} testFlow
     * @param {*} testCredentials
     * @returns Promise<void>
     */
    load(testNode, testFlow, testCredentials = {}) {
        return new Promise((resolve, reject) => {
            super.load(testNode, testFlow, testCredentials, (err) => {
                if(err) {
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    }

    /**
     * @param {string} id
     * @returns {import("@node-red/runtime/lib/nodes/Node")}
     */
    // @ts-ignore
    getNode(id) {
        // @ts-ignore
        return super.getNode(id);
    }

    /**
     * @param {import("@node-red/runtime/lib/nodes/Node")} sendingNode
     * @param {import("@node-red/runtime/lib/nodes/Node")} ReceivingNode
     * @returns Promise<any>
     */
    createTestPromise(sendingNode, ReceivingNode) {
        return new Promise((resolve, reject) => {
            let timeout = setTimeout(() => reject("test timeout"), 2000);
            ReceivingNode.on("input", function (msg) {
                clearTimeout(timeout);
                resolve(msg);
            });
            sendingNode.on("call:error", function (err) {
                clearTimeout(timeout);
                reject(err);
            });

        });
    }
}
module.exports = new Helper();
