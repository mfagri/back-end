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
    getprofile(username: string): Promise<import(".prisma/client").Profile>;
    inviteUser(userId: number, inviterId: number): Promise<string>;
}
