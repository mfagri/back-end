import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { MyGateway } from "src/getway/gateway";
export declare class UserController {
    private readonly userService;
    private jwtService;
    private readonly Mygiteway;
    constructor(userService: UserService, jwtService: JwtService, Mygiteway: MyGateway);
    Search(username: string): Promise<import(".prisma/client").User[] | {
        e: string;
    }>;
    addFriend(userId: string, req: any): Promise<{
        message: string;
        user: import(".prisma/client").User;
        error?: undefined;
    } | {
        error: string;
        message?: undefined;
        user?: undefined;
    }>;
    showfriends(id: string): Promise<import(".prisma/client").User[]>;
    usersRequest(req: any): Promise<import(".prisma/client").Profile[]>;
    getUser(iduser: string, req: any): Promise<boolean>;
    cancelreq(iduser: string, req: any): Promise<boolean>;
    deletefromefriends(iduser: string, req: any): Promise<boolean>;
    updateUser(req: any, uname: string, image: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    showprofile(username: string, req: any): Promise<{
        friend: string;
        requestsent: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        Userid: number;
        username: string;
        image: string;
        email: string;
        online: boolean;
    }>;
    getUserInbox(req: any): Promise<any[]>;
    deletreq(req: any, iduser: string): Promise<void>;
}
