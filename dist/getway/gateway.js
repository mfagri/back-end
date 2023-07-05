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
exports.MyGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
const user_service_1 = require("../user/user.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("../auth/constants");
let MyGateway = class MyGateway {
    constructor(prisma, serv, jwtService) {
        this.prisma = prisma;
        this.serv = serv;
        this.jwtService = jwtService;
    }
    handleConnection(socket) {
        console.log("Incoming Connection", socket.id);
        socket.on("newUser", async (data) => {
            try {
                try {
                    const userdata = await this.jwtService.verifyAsync(data.access_token, {
                        secret: constants_1.jwtConstants.secret,
                        ignoreExpiration: true,
                    });
                    const user = await this.prisma.user.findUnique({
                        where: {
                            intrrid: userdata.id,
                        },
                    });
                    const find = this.serv.myArray.find((obj) => {
                        return obj.element2 === socket.id;
                    });
                    if (!find) {
                        this.serv.myArray.push({
                            element1: user.username,
                            element2: socket.id,
                        });
                    }
                    const user1 = await this.prisma.user.update({
                        where: {
                            username: user.username,
                        },
                        data: {
                            profile: {
                                update: {
                                    online: true,
                                },
                            },
                        },
                    });
                }
                catch (e) {
                    throw new common_1.NotFoundException("not found");
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        socket.on("addUser", async (data) => {
            console.log("data = {", data);
            const isin = this.serv.myArray.find((obj) => {
                return obj.element2 === socket.id;
            });
            console.log(isin);
            if (!isin) {
                console.log("i saw it coming from miles away");
                return;
            }
            const profile = await this.prisma.profile.findUnique({
                where: {
                    id: data
                }
            });
            const user = await this.prisma.user.findUnique({
                where: {
                    id: profile.Userid,
                },
            });
            console.log("user = ", user);
            const arr = this.serv.myArray.filter((obj) => {
                return obj.element1 === user.username;
            });
            arr.map((element) => socket.to(element.element2).emit("receiveNotif"));
        });
        socket.on("cancelReq", async (data) => {
            const isin = this.serv.myArray.find((obj) => {
                return obj.element2 === socket.id;
            });
            console.log(isin);
            if (!isin) {
                console.log("i saw it coming from miles away");
                return;
            }
            const user = await this.prisma.user.findUnique({
                where: {
                    id: data,
                },
            });
            const arr = this.serv.myArray.filter((obj) => {
                return obj.element1 === user.username;
            });
            arr.map((element) => socket.to(element.element2).emit("cancelreq"));
        });
        socket.on("sendMessage", async ({ messageContent, userId, receiverId, roomId }) => {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: receiverId,
                },
            });
            const arr = this.serv.myArray.filter((obj) => {
                return obj.element1 === user.username;
            });
            arr.forEach((element) => {
                socket.to(element.element2).emit("Getmsg", {
                    userId,
                    roomId,
                    messageContent,
                });
            });
        });
    }
    async handleDisconnect(client) {
        const find = this.serv.myArray.find((obj) => {
            return obj.element2 === client.id;
        });
        console.log(find);
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    username: find.element1,
                },
            });
            this.serv.myArray = this.serv.myArray.filter((obj) => {
                return obj !== find;
            });
            console.log("new array");
            console.log(this.serv.myArray);
            const countUser = this.serv.myArray.filter((obj) => {
                return obj.element1 === find.element1;
            }).length;
            try {
                await this.prisma.user.update({
                    where: {
                        username: find.element1,
                    },
                    data: {
                        profile: {
                            update: {
                                online: countUser == 0 ? false : true,
                            },
                        },
                    },
                });
            }
            catch (e) { }
        }
        catch (e) { }
        console.log(`Client disconnected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MyGateway.prototype, "server", void 0);
MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true,
        },
        credentials: true,
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService,
        jwt_1.JwtService])
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.js.map