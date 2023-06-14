import { PrismaService } from '../prisma/prisma.service';
import { createGroupDto } from "../dto/room/createGroupDto";
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    getRoomMessages(roomId: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            id: number;
            username: string;
        };
    }[]>;
    createConversation(userId: number, joinWithId: number): Promise<void>;
    createGroup(roomInfo: createGroupDto): Promise<void>;
    joinRoom(roomId: number, userId: number): Promise<void>;
    addRoomToInbox(roomId: number, userId: number): Promise<void>;
    addUserToTheRoom(roomId: number, userId: number): Promise<void>;
}
