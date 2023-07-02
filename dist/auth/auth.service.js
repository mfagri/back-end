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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fortytwo_strategy_1 = require("./fortytwo.strategy");
const jwt_1 = require("@nestjs/jwt");
const token_sever_1 = require("./token.sever");
const mailer_1 = require("@nestjs-modules/mailer");
let AuthService = class AuthService {
    constructor(prisma, s42, jwtService, tokenService, mailerService) {
        this.prisma = prisma;
        this.s42 = s42;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
        this.mailerService = mailerService;
    }
    async userfind(user1) {
        const user = await this.prisma.user.findUnique({
            where: {
                intrrid: user1.id
            }
        });
        if (!user) {
            return null;
        }
        const payload = {
            id: user1.id,
            accestoken: user1.mytoken["accestoken"],
            refreshtoken: user1.mytoken["refreshtoken"],
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signup(dto, cookie) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    auth: dto.auth,
                    intrrid: cookie.id,
                    image: dto.image,
                    profile: {
                        create: {
                            image: dto.image,
                            username: dto.username,
                            email: dto.email,
                        }
                    }
                },
            });
            await this.prisma.inbox.create({
                data: {
                    inboxOf: { connect: { id: user.id } },
                },
            });
            return user;
        }
        catch (e) {
            console.log(e);
            if (e.code === "P2002") {
                throw new common_1.ForbiddenException("User already exist");
            }
            throw e;
        }
    }
    async findone(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                intrrid: id.toString(),
            }
        });
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, fortytwo_strategy_1.Strategy42, jwt_1.JwtService, token_sever_1.TokenService, mailer_1.MailerService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map