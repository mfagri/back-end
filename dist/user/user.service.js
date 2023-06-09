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
    async findByid(username) {
        const user = await this.prisma.user.findFirst({
            where: {
                username: username
            }
        });
        return user;
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
    async getprofile(id) {
        const profile = await this.prisma.profile.findUnique({
            where: {
                id: id
            }
        });
        return profile;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map