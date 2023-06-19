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
let MyGateway = class MyGateway {
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            this.socket1 = socket;
            console.log(`Client connected: ${socket.id}`);
            socket.on('newUser', async (data) => {
                console.log(data, "dfs");
                const user = await this.prisma.user.update({
                    where: {
                        username: data
                    },
                    data: {
                        auth: socket.id,
                        profile: {
                            update: {
                                online: true
                            }
                        }
                    }
                });
            });
            socket.on("addUser", async (data) => {
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: data
                    }
                });
                this.socket1.to(user.auth).emit("receiveNotif");
            });
        });
    }
    acceptuser(socket, id) {
        socket.to("all").emit("acceptreq");
    }
    async handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        await this.prisma.user.update({
            where: {
                auth: client.id,
            },
            data: {
                profile: {
                    update: {
                        online: false
                    }
                }
            }
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.js.map