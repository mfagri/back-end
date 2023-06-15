import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    idToUser: {};
    constructor(prisma: PrismaService);
    checkPermissions(userId: number, roomId: number): Promise<void>;
    createMessage(messageContent: string, userId: number, roomId: number): Promise<string>;
    getMessagesInTheRoom(roomId: number, take: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
        };
    }>;
}
