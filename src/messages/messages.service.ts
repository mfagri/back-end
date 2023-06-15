import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { TreeRepositoryUtils } from 'typeorm';

@Injectable()
export class MessagesService {
    idToUser = {}
    constructor (private prisma: PrismaService) {}

    async checkPermissions(userId: number, roomId: number) {
        const room = await this.prisma.room.findUnique({
            where: {
                id: roomId
            },
            select: {
                mutedUser: {
                    select: {
                        id: true,
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
            throw new BadRequestException('user not allowed');
        if (room.mutedUser.some(muted => muted.id === userId))
            throw new BadRequestException('this user is already muted');
    }
    async createMessage(messageContent: string, userId: number, roomId: number) {
        await this.checkPermissions(userId, roomId);
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
