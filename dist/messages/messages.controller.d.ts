import { MessagesService } from './messages.service';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
    createMessage(messageContent: string, userId: number, roomId: number): Promise<string>;
    getMessagesInTheRoom(roomId: number, take: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
        };
    }>;
}
