import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private authService;
    private jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    signup(req: any, dto: AuthDto, q: any): Promise<import(".prisma/client").User>;
    getProfile(req: any, a: any): Promise<import(".prisma/client").User>;
    fortyTwoAuth(): Promise<void>;
    logout(res: Response): Promise<void>;
    fortyTwoAuthRedirect(a: any, req: any, res: Response): Promise<void>;
}
