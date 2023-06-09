"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = void 0;
const passport_1 = require("@nestjs/passport");
class Serializer extends passport_1.PassportSerializer {
    serializeUser(user, done) {
        console.log("serialize", user);
        done(null, user);
    }
    deserializeUser(payload, done) {
        console.log("deserialize", payload);
        done(null, payload);
    }
}
exports.Serializer = Serializer;
//# sourceMappingURL=serilizer.js.map