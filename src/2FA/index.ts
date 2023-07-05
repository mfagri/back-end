 var qrcode = require('qrcode')
 var speakeasy = require("speakeasy");


 export function generatsecret(name: string)
 {
    console.log(name);
    return speakeasy.generateSecret({
        name: name
    })
 }


 export async function getqrcode(secret: any) {
    
    
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(secret.otpauth_url, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({"qrcode":data,"secret": secret.base32});
        }
      });
    });
  }
  
  export function validepass(secret: string,mytoken: string)
  {
    var tokenValidates = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: mytoken,
      window: 6
    });
    return tokenValidates;
  }