import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsService } from '../rooms/rooms.service';

@Module({
  controllers: [MessagesController],
  providers: [PrismaService, MessagesService, RoomsService]
})
export class MessagesModule {}
