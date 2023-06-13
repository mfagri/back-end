import { UserService } from "./user.service";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
export declare class UserController {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    Search(username: string): Promise<import(".prisma/client").User[] | {
        e: string;
    }>;
    addFriend(userId: string, friendId: string): Promise<any>;
    showfriends(id: string): Promise<import(".prisma/client").User[]>;
    usersRequest(id: string): Promise<import(".prisma/client").User[]>;
    usersEnvit(id: string): Promise<import(".prisma/client").User[]>;
    getUser(iduser: string, req: Request): Promise<boolean>;
    deletefromefriends(req: Request): Promise<boolean>;
    updateUser(req: Request, uname: string, image: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    showprofile(username: string, req: Request): Promise<{
        friend: string;
        requestsent: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        Userid: number;
        username: string;
        image: string;
        email: string;
    }>;
}
