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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_1 = require("../dto/auth");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const auth_guard42_1 = require("./auth.guard42");
const index_1 = require("../2FA/index");
const auth_guard_1 = require("./auth.guard");
const App = require("express");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async googleauth() {
        return await (0, index_1.getqrcode)((0, index_1.generatsecret)("2FA"));
    }
    verfey(data) {
        console.log(data);
        var s = (0, index_1.validepass)(data.secret, data.code);
        return s;
    }
    async signup(req, dto, q) {
        return this.authService.signup(dto, req.cookies["authcookie"]);
    }
    async getProfile(req, a) {
        a.authenticated = true;
        try {
            console.log("id is ", req.user.id);
            return this.authService.findone(req.user.id);
        }
        catch (e) {
            throw new common_1.ForbiddenException("no user here");
        }
    }
    async fortyTwoAuth() {
        console.log("42 login");
    }
    async logout(res) {
        res.clearCookie("authcookie", { expires: new Date() });
    }
    async fortyTwoAuthRedirect(a, req, res) {
        a.authenticated = true;
        const user = await this.authService.userfind(req.user);
        res.cookie("authcookie", req.user, {});
        if (!user) {
            return res.redirect("http://localhost:3000/register");
        }
        else {
            res.cookie("authcookie", user);
            return res.redirect("http://localhost:3000/");
        }
    }
};
__decorate([
    (0, common_1.Get)("2FA"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleauth", null);
__decorate([
    (0, common_1.Post)("2FA"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verfey", null);
__decorate([
    (0, common_1.Post)("signup"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuardJWS),
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard42_1.AuthGuard42),
    (0, common_1.Get)("42"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortyTwoAuth", null);
__decorate([
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard42_1.AuthGuard42),
    (0, common_1.Get)("/callback"),
    __param(0, (0, common_1.Session)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "fortyTwoAuthRedirect", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map