import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IsNotEmpty, isNotEmpty } from 'class-validator';
import { createMessageDto } from '../dto/message/createMessageDto';

@Controller('messages')
export class MessagesController {
    constructor (private messagesService: MessagesService) {}

    @Post('/createMessage')
    createMessage(@Body("messageContent") messageContent: string,
                  @Body("userId", ParseIntPipe) userId: number,
                  @Body("roomId", ParseIntPipe) roomId: number,
                  ) {
        return this.messagesService.createMessage(messageContent, userId, roomId);
    }

    @Post('/getMessagesInTheRoom/:roomId')
    getMessagesInTheRoom(@Param('roomId', ParseIntPipe) roomId: number, @Body('take') take: number) {
        return this.messagesService.getMessagesInTheRoom(roomId, take);
    }
}
