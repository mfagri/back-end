"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validepass = exports.getqrcode = exports.generatsecret = void 0;
var qrcode = require('qrcode');
var speakeasy = require("speakeasy");
function generatsecret(name) {
    console.log(name);
    return speakeasy.generateSecret({
        name: name
    });
}
exports.generatsecret = generatsecret;
async function getqrcode(secret) {
    return new Promise((resolve, reject) => {
        qrcode.toDataURL(secret.otpauth_url, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({ "qrcode": data, "secret": secret.base32 });
            }
        });
    });
}
exports.getqrcode = getqrcode;
function validepass(secret, mytoken) {
    var tokenValidates = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: mytoken,
        window: 6
    });
    return tokenValidates;
}
exports.validepass = validepass;
//# sourceMappingURL=index.js.map