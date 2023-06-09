import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";
import { MyObject } from "src/test";
export declare class UserService {
    private readonly prisma;
    private readonly roomService;
    constructor(prisma: PrismaService, roomService: RoomsService);
    findByid(id: number): Promise<import(".prisma/client").User>;
    myArray: MyObject[];
    getUserConversationInbox(userId: string): Promise<any[]>;
    addFriend(userId: string, friendId: number): Promise<import(".prisma/client").User>;
    getFriendRequest(userId: string): Promise<import(".prisma/client").Profile[]>;
    updateusername(id: string, username: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    searchuser(username: string): Promise<import(".prisma/client").User[]>;
    updateuserimage(id: string, image: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    getprofile(username: string, id: string): Promise<{
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
    inviteUser(userId: number, inviterId: string): Promise<import(".prisma/client").User & {
        requestedBy: import(".prisma/client").User[];
    }>;
    removefiend(id: number, myuserid: string): Promise<void>;
    rfriends(id: number): Promise<import(".prisma/client").User[]>;
    cancelreqest(myuserid: string, userid: number): Promise<import(".prisma/client").User & {
        requestedBy: import(".prisma/client").User[];
    }>;
    deletreq(myuserid: string, userid: number): Promise<boolean>;
}
