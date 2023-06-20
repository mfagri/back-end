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
import { UserService } from "src/user/user.service";
@WebSocketGateway(
    {
        cors:{
            origin:true
        }
    }
)
@Injectable()
export class MyGateway implements OnModuleInit{
    constructor(private readonly prisma: PrismaService,private readonly serv: UserService){}
    @WebSocketServer()
    server : Server;
    socket1 : Socket;
     onModuleInit() {
        console.log("in gateway --------------------------");
        console.log(this.serv.myArray);
        this.server.on('connection',(socket)=>{
            this.socket1 = socket;
            console.log(`Client connected: ${socket.id}`);
            // console.log(this.serv.myArray);
            socket.on('newUser',async (data)=> {
                //add user name and socketid
                
                this.serv.myArray.push({element1: data,element2: <string>socket.id});
                console.log("in gateway --------------------------");
                console.log( this.serv.myArray);
                
                const user =  await this.prisma.user.update({
                    where:{
                        username: data
                    },
                    
                    data:{
                        // auth: <string>socket.id,
                        profile:{
                            update:{
                                online: true
                            }
                        }
                    }
                    
                });
                
                // console.log("here",user);
            })
            // socket.on("addUser",async (data)=>{
            //     console.log(data,"aaa")
                
            //     const user = await this.prisma.user.findUnique({
            //         where:{
            //             id: data
            //         }
            //     });
            //     console.log("send requset to ");
            //     console.log(user.auth,"i see you");
            //     this.socket1.to(user.auth).emit("receiveNotif");

            // })
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
        //socket disconnect find username 
       const find =  this.serv.myArray.find((obj)=>{return obj.element2 === client.id})
       console.log(find);
        //find user in db using username
        try{
            const user = await this.prisma.user.findUniqueOrThrow(
               {
                where:{
                    username : find.element1
                }
               }
            );
            //delet from array
            this.serv.myArray = this.serv.myArray.filter((obj)=>{ return obj !== find})
            console.log("new array")
            console.log(this.serv.myArray);
            console.log("check number of user in array : ")
            const countUser = this.serv.myArray.filter((obj)=>{ return obj.element1 === find.element1}).length
            console.log(countUser);
            try{   
                await this.prisma.user.update({
                    where:{
                       username: find.element1,
                    },
                    
                    data:{
                        
                        profile:{
                            update:{
                                online: countUser == 0 ? false : true
                            }
                        }
                    }
                
                }
                );
               }
               catch(e)
               {}
            
            // const count = this.serv.myArray.
        }
        catch(e)
        {

        }
        //count username in array  if 0 online ---> offline
            //  try{   
            //      await this.prisma.user.update({
            //          where:{
            //             auth: client.id,
            //          },
                     
            //          data:{
                         
            //              profile:{
            //                  update:{
            //                      online: false
            //                  }
            //              }
            //          }
                 
            //      }
            //      );
            //     }
            //     catch(e)
            //     {}
        console.log(`Client disconnected: ${client.id}`);
    
}
}