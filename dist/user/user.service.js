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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rooms_service_1 = require("../rooms/rooms.service");
let UserService = class UserService {
    constructor(prisma, roomService) {
        this.prisma = prisma;
        this.roomService = roomService;
        this.myArray = [];
    }
    async findByid(id) {
        console.log("here");
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return user;
    }
    async getUserConversationInbox(userId) {
        let inbox11 = await this.prisma.user.findUnique({
            where: { intrrid: userId },
            include: {
                rooms: {
                    where: {
                        group: false,
                    },
                    select: {
                        id: true,
                        whoJoined: {
                            where: {
                                intrrid: {
                                    not: userId,
                                },
                            },
                            select: {
                                id: true,
                                username: true,
                                image: true,
                                profile: {
                                    select: {
                                        online: true,
                                    },
                                },
                            },
                        },
                        messages: {
                            select: {
                                createdAt: true,
                            },
                        },
                    },
                },
            },
        });
        let test = [];
        let i = 0;
        inbox11.rooms.map((room) => {
            test[i] = {
                roomId: room.id,
                receiverId: room.whoJoined.at(0).id,
                username: room.whoJoined.at(0).username,
                online: room.whoJoined.at(0).profile.online,
                image: room.whoJoined.at(0).image,
                createdAt: room.messages.length > 0 ? room.messages[room.messages.length - 1].createdAt : null,
            };
            i++;
        });
        test.sort((a, b) => {
            if (a.createdAt === null)
                return 1;
            if (b.createdAt === null)
                return -1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        return test;
    }
    async addFriend(userId, friendId) {
        const data = await this.prisma.user.findUnique({
            where: {
                intrrid: userId,
            },
            include: {
                friends: true,
            },
        });
        const friend = await this.prisma.user.findUnique({
            where: {
                id: friendId,
            },
        });
        const find = data.friends.find((obj) => {
            return obj.username === friend.username;
        });
        if (find)
            return null;
        const user = await this.prisma.user.update({
            where: { intrrid: userId },
            data: {
                friendsRelation: { connect: { id: friendId } },
            },
        });
        await this.prisma.user.update({
            where: { id: friendId },
            data: {
                friendsRelation: { connect: { intrrid: userId } },
                request: { disconnect: { id: friendId } },
            },
        });
        await this.prisma.user.update({
            where: { intrrid: userId },
            data: {
                requestedBy: { disconnect: { id: friendId } },
            },
        });
        const user1 = await this.prisma.user.findUnique({
            where: {
                intrrid: userId,
            },
        });
        await this.roomService.createConversation(user1.id, friendId);
        return friend;
    }
    async getFriendRequest(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                intrrid: userId,
            },
            include: {
                requestedBy: true,
            },
        });
        await this.prisma.user.update({
            where: {
                intrrid: userId,
            },
            data: {
                notif: false
            }
        });
        return user.requestedBy;
    }
    async getFriendsendRequest(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                request: true,
            },
        });
        return user.request;
    }
    async updateusername(id, username) {
        const user = await this.prisma.user.update({
            where: {
                intrrid: id,
            },
            data: {
                username: username,
                profile: {
                    update: {
                        username: username,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        return user;
    }
    async searchuser(username) {
        const result = await this.prisma.user.findMany({
            where: {
                username: {
                    startsWith: username,
                },
            },
        });
        return result;
    }
    async updateuserimage(id, image) {
        const user = await this.prisma.user.update({
            where: {
                intrrid: id,
            },
            data: {
                image: image,
                profile: {
                    update: {
                        image: image,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
        return user;
    }
    async getprofile(username, id) {
        try {
            const profile = await this.prisma.profile.findUniqueOrThrow({
                where: {
                    username: username,
                },
            });
            const result = await this.prisma.user.findUniqueOrThrow({
                where: {
                    intrrid: id,
                },
                include: {
                    friends: true,
                    request: true,
                },
            });
            const found = result.friends.find((obj) => {
                return obj.username === username;
            });
            const foundreq = result.request.find((obj) => {
                return obj.username == username;
            });
            console.log("here", foundreq);
            return Object.assign(Object.assign({}, profile), { friend: found ? "friend" : "", requestsent: foundreq ? "reqestsent" : "" });
        }
        catch (e) {
            throw new common_1.NotFoundException("404");
        }
    }
    async inviteUser(userId, inviterId) {
        console.log("hnaaaaaaaaa");
        console.log(this.myArray);
        const userToInvite = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                requestedBy: true,
            },
        });
        try {
            const inviter = await this.prisma.user.findUnique({
                where: { intrrid: inviterId },
            });
            const found = userToInvite.requestedBy.find((obj) => {
                return obj.username === inviter.username;
            });
            if (found)
                return userToInvite;
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    notif: true,
                    requestedBy: { connect: { intrrid: inviterId } },
                },
            });
            console.log("9alwa", updatedUser);
        }
        catch (error) {
            console.error(error);
        }
        return userToInvite;
    }
    async removefiend(id, myuserid) {
        const myuser = await this.prisma.user.findUnique({
            where: {
                intrrid: myuserid,
            },
        });
        try {
            await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    friends: {
                        disconnect: [{ intrrid: myuserid }],
                    },
                    friendsRelation: {
                        disconnect: [{ intrrid: myuserid }],
                    },
                },
                include: {
                    friends: true,
                },
            });
            const room = await this.prisma.room.findFirst({
                where: {
                    AND: [
                        { whoJoined: { some: { id: myuser.id } } },
                        { whoJoined: { some: { id: id } } },
                    ],
                },
                include: { whoJoined: true },
            });
            console.log("room id is === ", room);
            const room1 = await this.prisma.room.findUniqueOrThrow({
                where: { id: room.id },
                include: { messages: true, inbox: true },
            });
            await this.prisma.message.deleteMany({
                where: {
                    createdBy: {
                        id: myuser.id,
                    },
                },
            });
            await this.prisma.message.deleteMany({
                where: {
                    createdBy: {
                        id: id,
                    },
                },
            });
            await this.prisma.room.delete({
                where: {
                    id: room1.id,
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    async rfriends(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                friends: true,
            },
        });
        return user.friends;
    }
    async cancelreqest(myuserid, userid) {
        const userf = await this.prisma.user.update({
            where: {
                id: userid,
            },
            data: {
                requestedBy: {
                    disconnect: [{ intrrid: myuserid }],
                },
            },
            include: {
                requestedBy: true,
            },
        });
        await this.prisma.user.update({
            where: {
                intrrid: myuserid,
            },
            data: {
                request: {
                    disconnect: [{ id: userid }],
                },
            },
            include: {
                request: true,
            },
        });
        return userf;
    }
    async deletreq(myuserid, userid) {
        const userf = await this.prisma.user.update({
            where: {
                id: userid,
            },
            data: {
                request: {
                    disconnect: [{ intrrid: myuserid }],
                },
            },
            include: {
                request: true,
            },
        });
        await this.prisma.user.update({
            where: {
                intrrid: myuserid,
            },
            data: {
                requestedBy: {
                    disconnect: [{ id: userid }],
                },
            },
            include: {
                requestedBy: true,
            },
        });
        return userf.auth;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rooms_service_1.RoomsService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map