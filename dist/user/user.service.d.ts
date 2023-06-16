import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";
export declare class UserService {
    private readonly prisma;
    private readonly roomService;
    constructor(prisma: PrismaService, roomService: RoomsService);
    findByid(id: number): Promise<import(".prisma/client").User>;
    getUserConversationInbox(userId: string): Promise<{
        rooms: {
            whoJoined: {
                id: number;
                username: string;
                image: string;
            }[];
            messages: {
                createdAt: Date;
                content: string;
                createdBy: {
                    id: number;
                    username: string;
                };
            }[];
            id: number;
        }[];
    }>;
    addFriend(userId: number, friendId: number): Promise<import(".prisma/client").User>;
    getFriendRequest(userId: string): Promise<import(".prisma/client").User[]>;
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
    cancelreqest(myuserid: string, userid: number): Promise<boolean>;
}
