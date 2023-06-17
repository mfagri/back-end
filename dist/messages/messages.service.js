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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const moment = require("moment");
const rooms_service_1 = require("../rooms/rooms.service");
let MessagesService = class MessagesService {
    constructor(prisma, roomService) {
        this.prisma = prisma;
        this.roomService = roomService;
        this.idToUser = {};
    }
    async checkPermissionsForCreateMessage(userId, roomId) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId
            },
            select: {
                mutedUser: {
                    select: {
                        userId: true,
                        muteduntil: true,
                    }
                },
                whoJoined: {
                    select: {
                        id: true,
                    }
                }
            }
        });
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            }
        });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (!room.whoJoined.some(user => user.id === userId))
            throw new common_1.BadRequestException('user not in this room');
        if (room.mutedUser.some(muted => muted.userId === userId)) {
            if (room.mutedUser.some(muted => {
                if (muted.userId === userId) {
                    console.log("-----", moment().diff(muted.muteduntil, "seconds"));
                    if (moment().diff(muted.muteduntil, "seconds") > 0) {
                        this.roomService.unmuteTheUser(userId, roomId);
                        return false;
                    }
                    return true;
                }
                return false;
            }))
                throw new common_1.BadRequestException('this user is muted!!');
        }
    }
    async createMessage(messageContent, userId, roomId) {
        await this.checkPermissionsForCreateMessage(userId, roomId);
        const newMessage = await this.prisma.message.create({
            data: {
                content: messageContent,
                createdBy: {
                    connect: {
                        id: userId,
                    }
                },
                room: {
                    connect: {
                        id: roomId,
                    },
                }
            },
        });
        return "message created!!!";
    }
    async getMessagesInTheRoom(roomId, take) {
        const messages = this.prisma.message.findFirst({
            where: {
                roomId,
            },
            select: {
                content: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true,
                    }
                }
            }
        });
        return messages;
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rooms_service_1.RoomsService])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map