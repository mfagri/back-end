import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createMessageDto } from '../dto/message/createMessageDto';
// import { TreeRepositoryUtils } from 'typeorm';

@Injectable()
export class MessagesService {
    idToUser = {}
    constructor (private prisma: PrismaService) {}

    // async createMessage(messageInfo: createMessageDto) {
    async createMessage(messageContent: string, userId: number, roomId: number) {
        // let {messageContent, userId, roomId} = messageInfo;
        // roomId = Number(roomId);
        // userId = Number(userId);
        // roomId = parseInt(roomId, 10);
        // roomId = parseInt(roomId, 10);
        console.log("------------userId------------", userId);
        console.log("------------userId------------", roomId);
        console.log("------------userId------------", messageContent);
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
