// import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
// import { MessagesService } from './messages.service';
// import { Server, Socket } from 'socket.io';
// import { Client } from 'socket.io/dist/client';
// import { createMessageDto } from '../dto/message/createMessageDto';

// @WebSocketGateway( {cors: { origin: '*', }, } )
// export class MessagesGateway {
//   @WebSocketServer()
// 	server: Server
//   constructor(private readonly messagesService: MessagesService) {}


//   @SubscribeMessage('createMessage')
//   async create(@MessageBody() createMessageDto: createMessageDto, @ConnectedSocket() client: Socket) {
//     console.log(createMessageDto);
//     const message = await this.messagesService.createMessage(createMessageDto);
//     this.server.emit('message', message);

//   }

//   @SubscribeMessage('getMessagesInTheRoom')
//   getMessagesInTheRoom(@MessageBody('roomId') roomId: number, @MessageBody('take') take: number) {
//     return this.messagesService.getMessagesInTheRoom(roomId, take);
//   }

//   @SubscribeMessage('joinRoom')
//   joinRoom(@MessageBody('name') name: string, @ConnectedSocket() client: Socket) {
//     return this.messagesService.joinRoom(name, client);
//   }
  
//   @SubscribeMessage('isTyping')
//   async isTyping(@MessageBody('isTyping') isTyping: boolean, @ConnectedSocket() client: Socket) {
//     console.log ("typing");
//     const name = await this.messagesService.idName(client.id);
// 		client.broadcast.emit("isTyping", {name, isTyping});
//     // return this.messagesService.isTyping(isTyping__, client)
//   }


//   @SubscribeMessage('removeMessage')
//   remove(@MessageBody() id: number) {
//     return this.messagesService.remove(id);
//   }
// }
