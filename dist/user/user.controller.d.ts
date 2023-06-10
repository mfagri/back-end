import { UserService } from "./user.service";
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
export declare class UserController {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    addFriend(userId: string, friendId: string): Promise<any>;
    usersRequest(id: string): Promise<import(".prisma/client").User[]>;
    usersEnvit(id: string): Promise<import(".prisma/client").User[]>;
    getUser(): Promise<void>;
    updateUser(req: Request, uname: string, image: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
}
