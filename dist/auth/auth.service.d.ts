import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "../dto/auth";
import { Strategy42 } from "./fortytwo.strategy";
import { JwtService } from '@nestjs/jwt';
import { TokenService } from "./token.sever";
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthService {
    private prisma;
    private readonly s42;
    private jwtService;
    private tokenService;
    private readonly mailerService;
    constructor(prisma: PrismaService, s42: Strategy42, jwtService: JwtService, tokenService: TokenService, mailerService: MailerService);
    userfind(user1: any): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto, cookie: any): Promise<import(".prisma/client").User>;
    findone(id: number): Promise<import(".prisma/client").User>;
}
