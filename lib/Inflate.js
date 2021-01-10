const zlib = require("zlib");

module.exports = function Inflate(data) {
    return new Promise((resolve,reject) => {
        zlib.inflate(data, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
};
