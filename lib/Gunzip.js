const zlib = require("zlib");

module.exports = function Gunzip(data) {
    return new Promise((resolve,reject) => {
        zlib.gunzip(data, (err, data) => {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });         
    });       
};