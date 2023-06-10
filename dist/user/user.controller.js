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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../auth/constants");
let UserController = class UserController {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async Search(username) {
        if (username === '')
            return [];
        try {
            return this.userService.searchuser(username);
        }
        catch (e) {
            return { e: "no users" };
        }
    }
    async addFriend(userId, friendId) {
        try {
            console.log(userId);
            console.log(friendId);
            const numericId = parseInt(userId, 10);
            const numericId2 = parseInt(friendId, 10);
            const user = await this.userService.addFriend(numericId, numericId2);
            return { message: "Friend added successfully", user };
        }
        catch (error) {
            return { error: "Failed to add friend" };
        }
    }
    async showfriends(id) {
        const numericId = parseInt(id, 10);
        console.log(numericId);
        return this.userService.rfriends(numericId);
    }
    usersRequest(id) {
        const numericId = parseInt(id, 10);
        console.log(numericId);
        return this.userService.getFriendRequest(numericId);
    }
    usersEnvit(id) {
        const numericId = parseInt(id, 10);
        console.log("sendreq", numericId);
        return this.userService.getFriendsendRequest(numericId);
    }
    getUser(iduser, idfriend) {
        const numericId = parseInt(iduser, 10);
        const numericId2 = parseInt(idfriend, 10);
        return this.userService.inviteUser(numericId, numericId2);
    }
    async updateUser(req, uname, image) {
        try {
            const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
                secret: constants_1.jwtConstants.secret,
                ignoreExpiration: true,
            });
            if (uname && image) {
                this.userService.updateusername(data.id, uname);
                return this.userService.updateuserimage(data.id, image);
            }
            else if (uname)
                return this.userService.updateusername(data.id, uname);
            else if (image)
                return this.userService.updateuserimage(data.id, image);
        }
        catch (e) {
            throw new common_1.ForbiddenException("no user here");
        }
    }
    showprofile(username) {
        return this.userService.getprofile(username);
    }
};
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, common_1.Query)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Search", null);
__decorate([
    (0, common_1.Get)("accept"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, common_1.Query)("idfriend")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addFriend", null);
__decorate([
    (0, common_1.Get)("friends"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "showfriends", null);
__decorate([
    (0, common_1.Get)("myreq"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "usersRequest", null);
__decorate([
    (0, common_1.Get)("sendreq"),
    __param(0, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "usersEnvit", null);
__decorate([
    (0, common_1.Get)("invet"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, common_1.Query)("idfriend")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("username")),
    __param(2, (0, common_1.Body)("image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('showprofile'),
    __param(0, (0, common_1.Query)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "showprofile", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map