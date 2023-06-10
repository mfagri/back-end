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
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByid(id) {
        console.log('here');
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });
        return user;
    }
    async addFriend(userId, friendId) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                friendsRelation: { connect: { id: friendId } },
            },
        });
        await this.prisma.user.update({
            where: { id: friendId },
            data: {
                friendsRelation: { connect: { id: userId } },
            },
        });
        return user;
    }
    async getFriendRequest(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                requestedBy: true
            },
        });
        return user.requestedBy;
    }
    async getFriendsendRequest(userId) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                request: true
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
                profile: true
            }
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
                        profilepicter: image,
                    },
                },
            },
            include: {
                profile: true
            }
        });
        return user;
    }
    async getprofile(username) {
        try {
            const profile = await this.prisma.profile.findUniqueOrThrow({
                where: {
                    username: username,
                }
            });
            return profile;
        }
        catch (e) {
            throw new common_1.NotFoundException('404');
        }
    }
    async inviteUser(userId, inviterId) {
        try {
            console.log(userId);
            console.log(inviterId);
            const userToInvite = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userToInvite) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            const inviter = await this.prisma.user.findUnique({
                where: { id: inviterId },
            });
            if (!inviter) {
                throw new Error(`Inviter user with ID ${inviterId} not found.`);
            }
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    requestedBy: { connect: { id: inviterId } },
                },
            });
            console.log(`User with ID ${updatedUser.id} has been invited by user with ID ${inviter.id}.`);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await this.prisma.$disconnect();
        }
        return 'request sended';
    }
    async rfriends(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
            include: {
                friends: true
            }
        });
        return user.friends;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map