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
const moment = require("moment");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async muteTheUser(userId, mutedId, roomId, mutedDuration) {
        userId = Number(userId);
        roomId = Number(roomId);
        mutedId = Number(mutedId);
        mutedDuration = Number(mutedDuration);
        await this.checkMutingPermission(userId, mutedId, roomId);
        const now_ = moment().add(5, 'minutes');
        await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                mutedUser: {
                    create: {
                        muted: {
                            connect: {
                                id: mutedId,
                            }
                        },
                        muteduntil: "test",
                    }
                }
            }
        });
        return "user muted!";
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
        this.checkPermisionForCreateGroup(userId);
        const newRoom = await this.prisma.room.create({
            data: {
                group: true,
                room_name: groupName,
                roomPicture: roomInfo.roomPicture,
                whoJoined: {
                    connect: { id: userId },
                },
                role: {
                    create: {
                        owner: {
                            connect: {
                                id: userId
                            },
                        }
                    }
                }
            },
        });
        this.addRoomToInbox(newRoom.id, userId);
    }
    async changeRoleForTheUser(changeRoleInfo) {
        let { userId, roleId, changeId, roomId } = changeRoleInfo;
        roleId = Number(roleId);
        userId = Number(userId);
        changeId = Number(changeId);
        roomId = Number(roomId);
        await this.checkPermissionForChangeRole(userId, changeId, roleId, roomId);
        if (roleId === 0) {
            console.log("in");
            await this.prisma.role.update({
                where: {
                    roomId,
                },
                data: {
                    member: {
                        disconnect: {
                            id: changeId,
                        }
                    },
                    adminisrator: {
                        connect: {
                            id: changeId,
                        },
                    }
                }
            });
        }
        else if (roleId === 1) {
            console.log("in");
            await this.prisma.role.update({
                where: {
                    roomId,
                },
                data: {
                    adminisrator: {
                        disconnect: {
                            id: changeId,
                        }
                    },
                    member: {
                        connect: {
                            id: changeId,
                        },
                    }
                }
            });
        }
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
    async giveRoleToNewUser(roomId, userId) {
        const role = await this.prisma.role.update({
            where: { roomId },
            data: {
                member: {
                    connect: {
                        id: userId,
                    }
                }
            }
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
        this.giveRoleToNewUser(roomId, userId);
        this.addRoomToInbox(roomId, userId);
    }
    async checkPermissionForChangeRole(userId, changeId, roleId, roomId) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                group: true,
                role: {
                    select: {
                        owner: true,
                        member: true,
                        adminisrator: true,
                    }
                }
            }
        });
        if (!room || !room.group || !room.role)
            throw new common_1.BadRequestException('Invalid Group!!');
        if (roleId === 0) {
            if (room.role.owner.id !== userId)
                throw new common_1.UnauthorizedException("This user issn't authorized to give administrator role to others!!");
            if (room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("This user is already an administrator!!");
            if (!room.role.member.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User not member in this group!!");
        }
        else if (roleId === 1) {
            if (room.role.owner.id !== userId)
                throw new common_1.UnauthorizedException("This user issn't authorized to change role!!");
            if (room.role.member.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User is already just a member!!");
            if (!room.role.member.some(user => user.id === changeId) && !room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User not member in this group!!");
            if (!room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("This user is not a administrator!!");
        }
    }
    async checkMutingPermission(userId, mutedId, roomId) {
        var _a;
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                role: {
                    select: {
                        adminisrator: true,
                        member: true,
                        owner: true
                    }
                },
                group: true,
                mutedUser: true,
            }
        });
        if (!room || !room.group || !room.role)
            throw new common_1.BadRequestException("no group found!!");
        if (((_a = room.role) === null || _a === void 0 ? void 0 : _a.owner.id) != userId && !room.role.adminisrator.some(user => user.id === userId))
            throw new common_1.UnauthorizedException("Unauthorized user!!");
        if (!room.role.member.some(user => user.id === mutedId))
            throw new common_1.BadRequestException("user isn't a member!");
        if (room.mutedUser.some(user => user.userId === mutedId))
            throw new common_1.BadRequestException("user already muted!");
    }
    async checkPermisionForCreateGroup(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("user not found");
        }
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map