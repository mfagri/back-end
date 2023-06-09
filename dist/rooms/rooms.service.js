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
    async unbanTheUser(userId, banedId, roomId) {
        var _a;
        await this.checkPermisionForUnban(userId, banedId, roomId);
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                banedUsers: {
                    select: {
                        id: true,
                        userId: true,
                    }
                }
            }
        });
        if (!room)
            throw new common_1.NotFoundException("No room found");
        if (!room.banedUsers.length)
            throw new common_1.NotFoundException("No baned users found");
        const baneId = (_a = room.banedUsers.find(muted => muted.userId === banedId)) === null || _a === void 0 ? void 0 : _a.id;
        await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                banedUsers: {
                    disconnect: {
                        id: baneId,
                    }
                }
            }
        });
        return "user baned successfully!!";
    }
    async banTheUser(userId, banedId, roomId) {
        await this.checkPermisionForBan(userId, banedId, roomId);
        const room = await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                banedUsers: {
                    create: {
                        baned: {
                            connect: {
                                id: banedId,
                            }
                        }
                    }
                }
            }
        });
        return "user baned successfully!!";
    }
    async unmuteTheUser(mutedId, roomId) {
        var _a;
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                mutedUser: {
                    select: {
                        id: true,
                        userId: true,
                    }
                }
            }
        });
        if (!room)
            throw new common_1.NotFoundException("No room found");
        if (!room.mutedUser.length)
            throw new common_1.NotFoundException("No muted users found");
        const muteModelId = (_a = room.mutedUser.find(muted => muted.userId === mutedId)) === null || _a === void 0 ? void 0 : _a.id;
        console.log(muteModelId, roomId);
        await this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                mutedUser: {
                    delete: {
                        id: muteModelId,
                    }
                }
            }
        });
        return "user Unmuted!!";
    }
    async muteTheUser(userId, mutedId, roomId, muteDuration) {
        userId = Number(userId);
        roomId = Number(roomId);
        mutedId = Number(mutedId);
        muteDuration = Number(muteDuration);
        await this.checkMutingPermission(userId, mutedId, roomId);
        console.log();
        const now_ = moment().add(muteDuration, 'seconds').format();
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
                        muteduntil: now_,
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
        return "Role changed successfully!";
    }
    async joinRoom(roomId, userId) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                whoJoined: true,
                group: true,
            }
        });
        if (!room || !room.group) {
            throw new common_1.NotFoundException("No group founded!");
        }
        if (room.whoJoined.some(user => user.id === userId)) {
            throw new common_1.BadRequestException("User already joined!");
        }
        this.addUserToTheRoom(roomId, userId);
        this.addRoomToInbox(roomId, userId);
        return "user joined successfully!";
    }
    async addRoomToInbox(roomId, userId) {
        try {
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
        catch (e) {
        }
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
        const room = await this.prisma.room.update({
            where: { id: roomId },
            data: {
                whoJoined: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        if (!room)
            throw new common_1.NotFoundException("No room founded!");
        if (room.group)
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
                        userId: true,
                    }
                }
            }
        });
        if (!room || !room.group || !room.role)
            throw new common_1.BadRequestException('Invalid Group!!');
        if (roleId === 0) {
            if (room.role.owner.id !== userId && !room.role.adminisrator.some(user => user.id === userId))
                throw new common_1.UnauthorizedException("This user issn't authorized to give administrator role to other members!!");
            if (room.role.owner.id === changeId)
                throw new common_1.BadRequestException("This user is the ownor of this group group!!");
            if (room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("This user is already an administrator!!");
            if (!room.role.member.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User not member in this group!!");
        }
        else if (roleId === 1) {
            if (room.role.owner.id !== userId && !room.role.adminisrator.some(user => user.id === userId))
                throw new common_1.UnauthorizedException("This user issn't authorized to give member role to other administrators!!");
            if (room.role.owner.id === changeId)
                throw new common_1.BadRequestException("This user is the ownor of this group group!!");
            if (room.role.member.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User is already just a member!!");
            if (!room.role.member.some(user => user.id === changeId) && !room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("User not member in this group!!");
            if (!room.role.adminisrator.some(user => user.id === changeId))
                throw new common_1.BadRequestException("This user is not a administrator!!");
        }
    }
    async checkMutingPermission(userId, mutedId, roomId) {
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
        if (room.role.owner.id !== userId && !room.role.adminisrator.some(user => user.id === userId))
            throw new common_1.UnauthorizedException("Unauthorized user!!");
        if (room.role.owner.id === mutedId)
            throw new common_1.BadRequestException('You cant mute the owner');
        if (!room.role.member.some(user => user.id === mutedId) && !room.role.adminisrator.some(user => user.id === mutedId))
            throw new common_1.BadRequestException("user isn't a member!");
        if (room.mutedUser.some(user => user.userId === mutedId))
            throw new common_1.BadRequestException("user already muted!");
        if (mutedId === userId)
            throw new common_1.BadRequestException("can't mute yourself!");
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
    async checkPermisionForBan(userId, mutedId, roomId) {
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
                banedUsers: {
                    select: {
                        baned: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
            }
        });
        if (!room || !room.group || !room.role)
            throw new common_1.BadRequestException("no group found!!");
        if (room.role.owner.id !== userId && !room.role.adminisrator.some(user => user.id === userId))
            throw new common_1.UnauthorizedException("Unauthorized user!!");
        if (mutedId === userId)
            throw new common_1.BadRequestException("can't ban yourself!");
        if (room.role.owner.id === mutedId)
            throw new common_1.BadRequestException('You cant ban the owner');
        if (!room.role.member.some(user => user.id === mutedId) && !room.role.adminisrator.some(user => user.id === mutedId))
            throw new common_1.BadRequestException("user isn't a member!");
        if (room.banedUsers.some(user => user.baned.id === mutedId))
            throw new common_1.BadRequestException("user already baned!");
    }
    async checkPermisionForUnban(userId, mutedId, roomId) {
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
                banedUsers: {
                    select: {
                        baned: {
                            select: {
                                id: true,
                            }
                        }
                    }
                },
            }
        });
        if (!room || !room.group || !room.role)
            throw new common_1.BadRequestException("no group found!!");
        if (room.role.owner.id !== userId && !room.role.adminisrator.some(user => user.id === userId))
            throw new common_1.UnauthorizedException("Unauthorized user!!");
        if (mutedId === userId)
            throw new common_1.BadRequestException("can't unban yourself!");
        if (room.role.owner.id === mutedId)
            throw new common_1.BadRequestException('You cant unban the owner');
        if (!room.role.member.some(user => user.id === mutedId) && !room.role.adminisrator.some(user => user.id === mutedId))
            throw new common_1.BadRequestException("user isn't a member!");
        if (!room.banedUsers.some(user => user.baned.id === mutedId))
            throw new common_1.BadRequestException("user is not baned!");
    }
};
RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
exports.RoomsService = RoomsService;
//# sourceMappingURL=rooms.service.js.map