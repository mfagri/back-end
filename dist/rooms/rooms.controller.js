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
exports.RoomsController = void 0;
const common_1 = require("@nestjs/common");
const rooms_service_1 = require("./rooms.service");
const createGroupDto_1 = require("../dto/room/createGroupDto");
const changeRoleInfoDto_1 = require("../dto/room/changeRoleInfoDto");
let RoomsController = class RoomsController {
    constructor(roomsService) {
        this.roomsService = roomsService;
    }
    createGroup(roomInfo) {
        return this.roomsService.createGroup(roomInfo);
    }
    joinRoom(roomId, userId) {
        return this.roomsService.joinRoom(roomId, userId);
    }
    getRoomMessages(roomId) {
        return this.roomsService.getRoomMessages(roomId);
    }
    changeRoleForTheUser(changeRoleInfo) {
        return this.roomsService.changeRoleForTheUser(changeRoleInfo);
    }
    muteTheUser(id, mutedId, roomId, muteDuration) {
        return this.roomsService.muteTheUser(id, mutedId, roomId, muteDuration);
    }
};
__decorate([
    (0, common_1.Post)("/createGroup"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createGroupDto_1.createGroupDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "createGroup", null);
__decorate([
    (0, common_1.Put)("/joinRoom/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)("userId", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "joinRoom", null);
__decorate([
    (0, common_1.Get)("/getRoomMessages/:id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "getRoomMessages", null);
__decorate([
    (0, common_1.Patch)("/changeRoleForTheUser"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [changeRoleInfoDto_1.ChangeRoleInfoDto]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "changeRoleForTheUser", null);
__decorate([
    (0, common_1.Patch)("muteTheUser/:id"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)("mutedId")),
    __param(2, (0, common_1.Body)("roomId")),
    __param(3, (0, common_1.Body)("muteDuration")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], RoomsController.prototype, "muteTheUser", null);
RoomsController = __decorate([
    (0, common_1.Controller)("rooms"),
    __metadata("design:paramtypes", [rooms_service_1.RoomsService])
], RoomsController);
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map