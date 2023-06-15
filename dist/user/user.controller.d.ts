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
    addFriend(userId: string, req: Request): Promise<{
        message: string;
        user: import(".prisma/client").User;
        error?: undefined;
    } | {
        error: string;
        message?: undefined;
        user?: undefined;
    }>;
    showfriends(id: string): Promise<import(".prisma/client").User[]>;
    usersRequest(req: Request): Promise<import(".prisma/client").User[]>;
    usersEnvit(id: string): Promise<import(".prisma/client").User[]>;
    getUser(iduser: string, req: Request): Promise<boolean>;
    cancelreq(iduser: string, req: Request): Promise<boolean>;
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
    getUserInbox(req: Request): Promise<{
        rooms: {
            messages: {
                createdAt: Date;
                content: string;
                createdBy: {
                    username: string;
                    id: number;
                };
            }[];
            id: number;
            whoJoined: {
                username: string;
                image: string;
                id: number;
            }[];
        }[];
    }>;
}
