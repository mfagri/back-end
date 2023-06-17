import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';
import { RoomsService } from '../rooms/rooms.service';
// import { TreeRepositoryUtils } from 'typeorm';

@Injectable()
export class MessagesService {
    idToUser = {}
    constructor (private prisma: PrismaService,
                 private roomService: RoomsService) {}

    async checkPermissionsForCreateMessage(userId: number, roomId: number) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId
            },
            select: {
                mutedUser: {
                    select: {
                        userId: true,
                        muteduntil: true,
                    }
                },
                whoJoined: {
                    select: {
                        id: true,
                    }
                }
            }
        })
        if (!room)
            throw new BadRequestException('Room not found')
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
            }
        });
        if (!user)
            throw new BadRequestException('User not found')
        if (!room.whoJoined.some(user => user.id === userId))
            throw new BadRequestException('user not in this room');
        if (room.mutedUser.some(muted => muted.userId === userId)) {
            if (room.mutedUser.some(muted => {
                if (muted.userId === userId) {
                    console.log("-----", moment().diff(muted.muteduntil, "seconds"));
                    if (moment().diff(muted.muteduntil, "seconds") > 0) {
                    // if (true) {
                        this.roomService.unmuteTheUser(userId, roomId);
                        return false;
                    }
                    return true;
                }
                return false;
            }))
                throw new BadRequestException('this user is muted!!');
        }
    }
    async createMessage(messageContent: string, userId: number, roomId: number) {
        await this.checkPermissionsForCreateMessage(userId, roomId);
        const newMessage = await this.prisma.message.create({
            data: {
                content: messageContent,
                createdBy: {
                    connect: {
                        id: userId,
                    }
                },
                room : {
                    connect: {
                        id: roomId,
                    },
                }
            },
        })
        return "message created!!!";
    }

    async getMessagesInTheRoom(roomId: number, take: number) {
        const messages = this.prisma.message.findFirst({
            where: {
                roomId,
            },
            select: {
                content: true,
                createdAt: true,
                createdBy: {
                    select: {
                        username: true,
                    }
                }
            }
        })
        return messages;
    }

//     async joinRoom(name: string, client: Socket) {
// 		this.idToUser[client.id] = name;
// 		return Object.values(this.idToUser)
// 	}
}
