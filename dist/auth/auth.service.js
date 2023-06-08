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
let AuthService = class AuthService {
    constructor(prisma, s42, jwtService, tokenService) {
        this.prisma = prisma;
        this.s42 = s42;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
    }
    async login(dto) {
        console.log('in login');
        console.log('in login2');
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        const payload = { id: user.id,
            data: dto,
            accestoken: this.s42.tokens,
            refreshtoken: this.s42.refresh,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async userfind(user1) {
        console.log(this.s42.tokens);
        const user = await this.prisma.user.findUnique({
            where: {
                token: user1.accestoken
            }
        });
        if (!user) {
            return null;
        }
        const payload = { id: user.id,
            accestoken: user1.accestoken,
            refreshtoken: user1.refreshtoken,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signup(dto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    auth: dto.auth,
                    token: this.s42.tokens,
                    image: dto.image,
                    profile: {
                        create: {
                            profilepicter: dto.image,
                            username: dto.username,
                            email: dto.email,
                        }
                    }
                },
            });
            return user;
        }
        catch (e) {
            if (e.code === "P2002") {
                throw new common_1.ForbiddenException("User already exist");
            }
            throw e;
        }
    }
    async findone(id) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id,
            }
        });
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, fortytwo_strategy_1.Strategy42, jwt_1.JwtService, token_sever_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map