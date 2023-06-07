import { UserService } from "./user.service";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
export declare class UserController {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    users(id: string): Promise<import(".prisma/client").Profile>;
    updateUser(req: Request, uname: string, image: string): Promise<import(".prisma/client").User>;
}
