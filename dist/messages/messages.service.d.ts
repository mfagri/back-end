import { PrismaService } from '../prisma/prisma.service';
export declare class MessagesService {
    private prisma;
    idToUser: {};
    constructor(prisma: PrismaService);
    createMessage(messageContent: string, userId: number, roomId: number): Promise<void>;
    getMessagesInTheRoom(roomId: number, take: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
        };
    }>;
}
