import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    login(dto: AuthDto): Promise<{
        access_token: string;
    }>;
    signup(req: any, dto: AuthDto): Promise<import(".prisma/client").User>;
    getProfile(req: any): Promise<import(".prisma/client").User>;
    fortyTwoAuth(): Promise<void>;
    fortyTwoAuthRedirect(req: any, res: Response): Promise<void>;
}
