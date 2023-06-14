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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRoomMessages(roomId) {
        const messages = await this.prisma.message.findMany({
            orderBy: {
                createdAt: "asc",
            },
            take: 10,
            where: {
                roomId,
            },
            select: {
                content: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true,
                        id: true,
                    },
                },
            },
        });
        if (!messages) {
            throw new common_1.NotFoundException("No messages found in this room");
        }
        return messages;
    }
    async createConversation(userId, joinWithId) {
        userId = Number(userId);
        joinWithId = Number(joinWithId);
        const newRoom = await this.prisma.room.create({
            data: {
                whoJoined: {
                    connect: { id: userId },
                },
            },
        });
        this.addRoomToInbox(newRoom.id, userId);
        this.addUserToTheRoom(newRoom.id, joinWithId);
    }
    async createGroup(roomInfo) {
        let { userId, groupName } = roomInfo;
        userId = Number(userId);
        const newRoom = await this.prisma.room.create({
            data: {
                group: true,
                room_name: groupName,
                whoJoined: {
                    connect: { id: userId },
                },
            },
        });
        this.addRoomToInbox(newRoom.id, userId);
    }
    async joinRoom(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            }
        });
        if (!room || !room.group) {
            throw new common_1.NotFoundException("No group founded!");
        }
        this.addUserToTheRoom(roomId, userId);
        this.addRoomToInbox(roomId, userId);
    }
    async addRoomToInbox(roomId, userId) {
        await this.prisma.inbox.update({
            where: {
                userId: userId,
            },
            data: {
                rooms: {
                    connect: {
                        id: roomId,
                    },
                },
            },
        });
    }
    async addUserToTheRoom(roomId, userId) {
        await this.prisma.room.update({
            where: { id: roomId },
            data: {
                whoJoined: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        this.addRoomToInbox(roomId, userId);
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map