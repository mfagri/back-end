import { Injectable, OnModuleInit } from "@nestjs/common";
import { 
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer} from "@nestjs/websockets";
import { Prisma } from "@prisma/client";
import {Server, Socket} from "socket.io"
import { PrismaService } from "src/prisma/prisma.service";
@WebSocketGateway(
    {
        cors:{
            origin:true
        }
    }
)
@Injectable()
export class MyGateway implements OnModuleInit{
    constructor(private readonly prisma: PrismaService,){}
    @WebSocketServer()
    server : Server;
    socket1 : Socket;
     onModuleInit() {
        this.server.on('connection',(socket)=>{
            this.socket1 = socket;
            console.log(`Client connected: ${socket.id}`);
            // console.log(socket);
            socket.on('newUser',async (data)=> {
                console.log(data,"dfs");
                const user =  await this.prisma.user.update({
                    where:{
                        username: data
                    },
                    
                    data:{
                        auth: <string>socket.id,
                        profile:{
                            update:{
                                online: true
                            }
                        }
                    }
    
                });
                
                // console.log("here",user);
            })
            socket.on("addUser",async (data)=>{
                // console.log(data,"aaa")
           
                const user = await this.prisma.user.findUnique({
                    where:{
                        id: data
                    }
                })
                this.socket1.to(user.auth).emit("receiveNotif");

            })
        })
    }
    // @SubscribeMessage('msg')
    // handleEvent(@ConnectedSocket() client: Socket, data: string): string {//reserv from client
    //     // id === messageBody.id
    //     console.log(client.id,"______");
    //     console.log(data)
    //     client.on('msg', (data) => console.log(data));
    //     const count = this.server.engine.clientsCount; 
    //     console.log("number is = ",count)
    //     return data;
    
    //   }
    // acceptuser(socket :Socket,id: string)
    // {
    //     socket.to("all").emit("acceptreq");
    // }
    // sendmsg()
    // {
    //     console.log("ddddddd");
    //     this.server.to("all").emit("msg", {"hello": "you"});
    // }
    // // onNewmessage(@MessageBody() body: any,)
    // // {
    // //     console.log("we are here , we are waiting", body)
    // //     this.server.to('all').emit('onMessage', {msg: body});
    // //     this.server.emit("onMessage",{
    // //         msg: body,
            
    // //     })
    // // }
    async handleDisconnect(client: Socket) {
             try{
                    
                 await this.prisma.user.update({
                     where:{
                        auth: client.id,
                     },
                     
                     data:{
                         
                         profile:{
                             update:{
                                 online: false
                             }
                         }
                     }
                 
                 }
                 );
                }
                catch(e)
                {}
        console.log(`Client disconnected: ${client.id}`);
    
}
}