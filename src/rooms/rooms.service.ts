import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient, Message } from "@prisma/client";
import { PrismaService } from '../prisma/prisma.service';
import { take } from "rxjs";
import { createConversationDto } from "../dto/room/createConversationDto";
import { createGroupDto } from "../dto/room/createGroupDto";

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async getRoomMessages(roomId: number) {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
      where: {
        roomId,
      },
      select: {
        content: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    if (!messages) {
      throw new NotFoundException("No messages found in this room");
    }
    return messages;
  }

  async createConversation(userId: number, joinWithId: number){
    // let { userId, joinWithId } = roomInfo;
    
    userId = Number(userId);
    joinWithId = Number(joinWithId);
    const newRoom = await this.prisma.room.create({
      data: {
        whoJoined: {
          connect: { id: userId },
        },
      },
    });
    this.addRoomToInbox(newRoom.id, userId);
    this.addUserToTheRoom(newRoom.id, joinWithId);
  }
  
  async createGroup(roomInfo: createGroupDto) {
    let { userId, groupName } = roomInfo;
    
    userId = Number(userId);
    const newRoom = await this.prisma.room.create({
      data: {
        group: true,
        room_name: groupName,
        whoJoined: {
          connect: { id: userId },
        },
      },
    });
    this.addRoomToInbox(newRoom.id, userId);
  }

  async joinRoom(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: roomId,
      }
    })
    if (!room || !room.group) {
      throw new NotFoundException("No group founded!");
    }
    this.addUserToTheRoom(roomId, userId);
    this.addRoomToInbox(roomId, userId);
  }

  async addRoomToInbox(roomId: number, userId: number) {
    await this.prisma.inbox.update({
      where: {
        userId: userId,
      },
      data: {
        rooms: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }

  async addUserToTheRoom(roomId: number, userId: number) {
    await this.prisma.room.update({
      where: { id: roomId },
      data: {
        whoJoined: {
          connect: {
            id: userId,
          },
        },
      },
    });
    this.addRoomToInbox(roomId, userId);
  }
}
