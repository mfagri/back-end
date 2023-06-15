import { RoomsService } from "./rooms.service";
import { createGroupDto } from "../dto/room/createGroupDto";
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
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
