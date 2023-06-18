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
exports.MyGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../prisma/prisma.service");
let MyGateway = class MyGateway {
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(`Client connected: ${socket.id}`);
            socket.on('newUser', async (data) => {
                console.log(data, "dfs");
            });
            socket.on("addUser", async (data) => {
                console.log(data, "9aaalwa");
                const user = await this.prisma.user.findUnique({
                    where: {
                        id: data
                    }
                });
                socket.to(user.auth).emit("receiveNotif");
            });
        });
    }
    handleEvent(client, data) {
        console.log(client.id, "______");
        console.log(data);
        client.on('msg', (data) => console.log(data));
        const count = this.server.engine.clientsCount;
        console.log("number is = ", count);
        return data;
    }
    sendmsg() {
        console.log("ddddddd");
        this.server.to("all").emit("msg", { "hello": "you" });
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MyGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('msg'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", String)
], MyGateway.prototype, "handleEvent", null);
MyGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: true
        }
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MyGateway);
exports.MyGateway = MyGateway;
//# sourceMappingURL=gateway.js.map