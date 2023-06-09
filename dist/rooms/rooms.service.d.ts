import { ChangeRoleInfoDto } from "../dto/room/changeRoleInfoDto";
import { createGroupDto } from "../dto/room/createGroupDto";
import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    unbanTheUser(userId: number, banedId: number, roomId: number): Promise<string>;
    banTheUser(userId: number, banedId: number, roomId: number): Promise<string>;
    unmuteTheUser(mutedId: number, roomId: number): Promise<string>;
    muteTheUser(userId: number, mutedId: number, roomId: number, muteDuration: number): Promise<string>;
    getRoomMessages(roomId: number): Promise<{
        createdAt: Date;
        content: string;
        createdBy: {
            username: string;
            id: number;
        };
    }[]>;
    createConversation(userId: number, joinWithId: number): Promise<void>;
    createGroup(roomInfo: createGroupDto): Promise<void>;
    changeRoleForTheUser(changeRoleInfo: ChangeRoleInfoDto): Promise<string>;
    joinRoom(roomId: number, userId: number): Promise<string>;
    addRoomToInbox(roomId: number, userId: number): Promise<void>;
    giveRoleToNewUser(roomId: number, userId: number): Promise<void>;
    addUserToTheRoom(roomId: number, userId: number): Promise<void>;
    checkPermissionForChangeRole(userId: number, changeId: number, roleId: number, roomId: number): Promise<void>;
    checkMutingPermission(userId: number, mutedId: number, roomId: number): Promise<void>;
    checkPermisionForCreateGroup(userId: number): Promise<void>;
    checkPermisionForBan(userId: number, mutedId: number, roomId: number): Promise<void>;
    checkPermisionForUnban(userId: number, mutedId: number, roomId: number): Promise<void>;
}
