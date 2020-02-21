const NodeTestHelper = require("node-red-node-test-helper");

class Helper extends NodeTestHelper.NodeTestHelper {
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
}
module.exports = new Helper();
