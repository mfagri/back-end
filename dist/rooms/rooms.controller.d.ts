import { RoomsService } from "./rooms.service";
import { createGroupDto } from "../dto/room/createGroupDto";
import { ChangeRoleInfoDto } from "../dto/room/changeRoleInfoDto";
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    createGroup(roomInfo: createGroupDto): Promise<void>;
    joinRoom(roomId: number, userId: number): Promise<string>;
    getRoomMessages(roomId: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
            id: number;
        };
    }[]>;
    changeRoleForTheUser(changeRoleInfo: ChangeRoleInfoDto): Promise<string>;
    muteTheUser(id: number, mutedId: number, roomId: number, muteDuration: number): Promise<string>;
    banTheUser(userId: number, mutedId: number, roomId: number): Promise<string>;
    unbanTheUser(userId: number, mutedId: number, roomId: number): Promise<string>;
}
