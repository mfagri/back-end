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
let MyGateway = class MyGateway {
    constructor(prisma, serv) {
        this.prisma = prisma;
        this.serv = serv;
    }
    onModuleInit() {
        console.log("in gateway --------------------------");
        console.log(this.serv.myArray);
        this.server.on('connection', (socket) => {
            this.socket1 = socket;
            console.log(`Client connected: ${socket.id}`);
            socket.on('newUser', async (data) => {
                this.serv.myArray.push({ element1: data, element2: socket.id });
                console.log("in gateway --------------------------");
                console.log(this.serv.myArray);
                const user = await this.prisma.user.update({
                    where: {
                        username: data
                    },
                    data: {
                        profile: {
                            update: {
                                online: true
                            }
                        }
                    }
                });
            });
        });
    }
    async handleDisconnect(client) {
        const find = this.serv.myArray.find((obj) => { return obj.element2 === client.id; });
        console.log(find);
        try {
            const user = await this.prisma.user.findUniqueOrThrow({
                where: {
                    username: find.element1
                }
            });
            this.serv.myArray = this.serv.myArray.filter((obj) => { return obj !== find; });
            console.log("new array");
            console.log(this.serv.myArray);
            console.log("check number of user in array : ");
            const countUser = this.serv.myArray.filter((obj) => { return obj.element1 === find.element1; }).length;
            console.log(countUser);
            try {
                await this.prisma.user.update({
                    where: {
                        username: find.element1,
                    },
                    data: {
                        profile: {
                            update: {
                                online: countUser == 0 ? false : true
                            }
                        }
                    }
                });
            }
            catch (e) { }
        }
        catch (e) {
        }
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
            origin: true
        }
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, user_service_1.UserService])
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.js.map