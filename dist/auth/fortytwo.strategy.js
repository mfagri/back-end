"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy42 = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const common_1 = require("@nestjs/common");
let Strategy42 = class Strategy42 extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor() {
        super({
            clientID: "u-s4t2ud-d2078e9c2d7ea34d37a5adffa013cee9c2715889268480c4eba8a13a93ec6469",
            clientSecret: "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",
            callbackURL: "http://localhost:5000/auth/callback",
            scope: 'public',
            Profile: {}
        });
    }
    async validate(accessToken, refreshToken, profile, done) {
        if (!accessToken) {
            throw new common_1.UnauthorizedException("Access token missing");
        }
        this.tokens = accessToken;
        this.refresh = refreshToken;
        const user = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        const payload = {
            accestoken: accessToken,
            refreshtoken: refreshToken,
        };
        console.log("/////", profile.id, "//////");
        return { id: profile.id, mytoken: payload };
    }
};
Strategy42 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Strategy42);
exports.Strategy42 = Strategy42;
//# sourceMappingURL=fortytwo.strategy.js.map