"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const fortytwo_strategy_1 = require("../auth/fortytwo.strategy");
const token_sever_1 = require("../auth/token.sever");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const prisma_service_1 = require("../prisma/prisma.service");
const rooms_service_1 = require("../rooms/rooms.service");
const gateway_1 = require("../getway/gateway");
let userModule = class userModule {
};
userModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, fortytwo_strategy_1.Strategy42, token_sever_1.TokenService, prisma_service_1.PrismaService, user_service_1.UserService, rooms_service_1.RoomsService, gateway_1.MyGateway],
    })
], userModule);
exports.userModule = userModule;
//# sourceMappingURL=user.module.js.map