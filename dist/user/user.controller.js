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
const gateway_1 = require("../getway/gateway");
let UserController = class UserController {
    constructor(userService, jwtService, Mygiteway) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.Mygiteway = Mygiteway;
    }
    async Search(username) {
        if (username === "")
            return [];
        try {
            return this.userService.searchuser(username);
        }
        catch (e) {
            return { e: "no users" };
        }
    }
    async addFriend(userId, req) {
        try {
            const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
                secret: constants_1.jwtConstants.secret,
                ignoreExpiration: true,
            });
            console.log("userid = ", userId);
            console.log("intara id = ", data.id);
            const numericId = parseInt(userId, 10);
            const user = await this.userService.addFriend(data.id, numericId);
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
    async usersRequest(req) {
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        return this.userService.getFriendRequest(data.id);
    }
    usersEnvit(id) {
        const numericId = parseInt(id, 10);
        console.log("sendreq", numericId);
        return this.userService.getFriendsendRequest(numericId);
    }
    async getUser(iduser, req) {
        const numericId = parseInt(iduser, 10);
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        const user = this.userService.inviteUser(numericId, data.id);
        return true;
    }
    async cancelreq(iduser, req) {
        const numericId = parseInt(iduser, 10);
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        const user = this.userService.cancelreqest(data.id, numericId);
        return true;
    }
    async deletefromefriends(iduser, req) {
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        const numericId = parseInt(iduser, 10);
        this.userService.removefiend(numericId, data.id);
        return true;
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
    async showprofile(username, req) {
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        return this.userService.getprofile(username, data.id);
    }
    async getUserInbox(req) {
        console.log("here");
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        return this.userService.getUserConversationInbox(data.id);
    }
    async deletreq(req, iduser) {
        const data = await this.jwtService.verifyAsync(req.cookies["authcookie"]["access_token"], {
            secret: constants_1.jwtConstants.secret,
            ignoreExpiration: true,
        });
        const numericId = parseInt(iduser, 10);
        this.userService.deletreq(data.id, numericId);
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
    __param(0, (0, common_1.Query)("idfriend")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
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
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)("cancel"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cancelreq", null);
__decorate([
    (0, common_1.Get)("remove"),
    __param(0, (0, common_1.Query)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deletefromefriends", null);
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
    (0, common_1.Get)("showprofile"),
    __param(0, (0, common_1.Query)("username")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "showprofile", null);
__decorate([
    (0, common_1.Get)("/getUserConversationInbox/"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInbox", null);
__decorate([
    (0, common_1.Get)("deletreq"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deletreq", null);
UserController = __decorate([
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        gateway_1.MyGateway])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map