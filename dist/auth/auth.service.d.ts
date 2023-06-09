import { AuthDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Strategy42 } from "./fortytwo.strategy";
import { JwtService } from '@nestjs/jwt';
import { TokenService } from "./token.sever";
export declare class AuthService {
    private prisma;
    private readonly s42;
    private jwtService;
    private tokenService;
    constructor(prisma: PrismaService, s42: Strategy42, jwtService: JwtService, tokenService: TokenService);
    userfind(user1: any): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto, cookie: any): Promise<import(".prisma/client").User>;
    findone(id: number): Promise<import(".prisma/client").User>;
}
