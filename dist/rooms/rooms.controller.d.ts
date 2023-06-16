import { RoomsService } from "./rooms.service";
import { createGroupDto } from "../dto/room/createGroupDto";
import { ChangeRoleInfoDto } from "../dto/room/changeRoleInfoDto";
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    createGroup(roomInfo: createGroupDto): Promise<void>;
    joinRoom(roomId: number, userId: number): Promise<void>;
    getRoomMessages(roomId: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            id: number;
            username: string;
        };
    }[]>;
    changeRoleForTheUser(changeRoleInfo: ChangeRoleInfoDto): Promise<void>;
    muteTheUser(id: number, mutedId: number, roomId: number, muteDuration: number): Promise<string>;
}
