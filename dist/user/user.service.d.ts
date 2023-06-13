import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByid(id: number): Promise<import(".prisma/client").User>;
    addFriend(userId: number, friendId: number): Promise<import(".prisma/client").User>;
    getFriendRequest(userId: number): Promise<import(".prisma/client").User[]>;
    getFriendsendRequest(userId: number): Promise<import(".prisma/client").User[]>;
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
    }>;
    inviteUser(userId: number, inviterId: string): Promise<boolean>;
    removefiend(id: number, myuserid: string): Promise<void>;
    rfriends(id: number): Promise<import(".prisma/client").User[]>;
}
