import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';
export declare class MessagesService {
    private prisma;
    private roomService;
    idToUser: {};
    constructor(prisma: PrismaService, roomService: RoomsService);
    checkPermissionsForCreateMessage(userId: number, roomId: number): Promise<void>;
    createMessage(messageContent: string, userId: number, roomId: number): Promise<string>;
    getMessagesInTheRoom(roomId: number, take: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
        };
    }>;
}
