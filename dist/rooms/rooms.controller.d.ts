import { RoomsService } from "./rooms.service";
import { createConversationDto } from "../dto/room/createConversationDto";
import { createGroupDto } from "../dto/room/createGroupDto";
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    createConversation(roomInfo: createConversationDto): void;
    createGroup(roomInfo: createGroupDto): Promise<void>;
    joinRoom(roomId: number, userId: number): Promise<void>;
    getRoomMessages(roomId: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
            id: number;
        };
    }[]>;
}
