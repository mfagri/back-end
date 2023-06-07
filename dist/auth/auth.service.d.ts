import { AuthDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Strategy42 } from "./fortytwo.strategy";
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly prisma;
    private readonly s42;
    private jwtService;
    constructor(prisma: PrismaService, s42: Strategy42, jwtService: JwtService);
    login(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    userfind(): Promise<{
        access_token: string;
    }>;
    signup(dto: AuthDto): Promise<import(".prisma/client").User>;
    findone(id: number): Promise<import(".prisma/client").User>;
}
