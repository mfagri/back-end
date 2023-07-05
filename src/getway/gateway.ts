import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Req,
} from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Prisma } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { AuthenticatedSocket } from "./test1";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { async } from "rxjs";
@WebSocketGateway({
  cors: {
    origin: true,
  },
  credentials: true,
})
// @Injectable()
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serv: UserService,
    private readonly jwtService: JwtService
  ) {}

  @WebSocketServer()
  server: Server;
  // handleConnection(client) {
  //     console.log("connection to socket... token = ", client.handshake.query.token)
  // }
  handleConnection(socket: any) {
    console.log("Incoming Connection", socket.id);
    // console.log("data = ",data);
    // this.sessions.setUserSocket(socket.user.id, socket);
    // socket.emit('connected', {});
    //wtf

    // console.log("in gateway --------------------------");
    // console.log(this.serv.myArray);
    // this.server.on('connection',(socket)=>{
    //     // this.socket1 = socket;
    //     console.log(`Client connected: ${socket.id}`);
    //     // console.log(this.serv.myArray);
    //     socket.on('newUser',async (data)=> {
    //         //add user name and socketid

    //         this.serv.myArray.push({element1: data,element2: <string>socket.id});
    //         console.log("in gateway --------------------------");
    //         console.log( this.serv.myArray);

    //         const user =  await this.prisma.user.update({
    //             where:{
    //                 username: data
    //             },

    //             data:{
    //                 // auth: <string>socket.id,
    //                 profile:{
    //                     update:{
    //                         online: true
    //                     }
    //                 }
    //             }

    //         });

    //         // console.log("here",user);
    //     })
    socket.on("newUser", async (data) => {
      // console.log("id is ",socket.id)
      try {
        try {
          const userdata = await this.jwtService.verifyAsync(
            data.access_token,

            {
              secret: jwtConstants.secret,
              ignoreExpiration: true,
            }
          );
          const user = await this.prisma.user.findUnique({
            where: {
              intrrid: userdata.id,
            },
          });
          const find = this.serv.myArray.find((obj) => {
            return obj.element2 === socket.id;
          });
          if (!find) {
            this.serv.myArray.push({
              element1: user.username,
              element2: socket.id,
            });
          }
          const user1 = await this.prisma.user.update({
            where: {
              username: user.username,
            },

            data: {
              // auth: <string>socket.id,
              profile: {
                update: {
                  online: true,
                },
              },
            },
          });
        } catch (e) {
          throw new NotFoundException("not found");
        }
        // console.log(user);
      } catch (e) {
        console.log(e);
      }
      // console.log(user.auth,"i see you");
      // socket.to(user.auth).emit("receiveNotif");
    });
    socket.on("addUser", async (data) => {
      console.log("data = {",data)

      const isin = this.serv.myArray.find((obj) => {
        return obj.element2 === socket.id;
      });
      console.log(isin);
      if (!isin) {
        console.log("i saw it coming from miles away");
        return;
      }
      const profile = await this.prisma.profile.findUnique({
        where:{
          id:data
        }
      })
      const user = await this.prisma.user.findUnique({
        where: {
          id: profile.Userid,
        },
      });
      console.log("user = " ,user)
      const arr = this.serv.myArray.filter((obj) => {
        return obj.element1 === user.username;
      });

      arr.map((element) => socket.to(element.element2).emit("receiveNotif"));
    });

    socket.on("cancelReq", async (data) => {
      // console.log("hello you",socket.id)
      const isin = this.serv.myArray.find((obj) => {
        return obj.element2 === socket.id;
      });
      console.log(isin);
      if (!isin) {
        console.log("i saw it coming from miles away");
        return;
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id: data,
        },
      });
      const arr = this.serv.myArray.filter((obj) => {
        return obj.element1 === user.username;
      });

      arr.map((element) => socket.to(element.element2).emit("cancelreq"));
    });

// socket.on("sentMessage", async (data) => {
    //     // console.log("msg ", data);
    //     const isin = this.serv.myArray.find((obj) => {
    //         return obj.element2 === socket.id;
    //       });
    //       console.log(isin);
    //       if (!isin) {
    //         console.log("i saw it coming from miles away");
    //         return;
    //       }
    //       const user = await this.prisma.user.findUnique({
    //         where: {
    //           id: data,
    //         },
    //       });
    //     //   console.log("user chat",user);
    //       const arr = this.serv.myArray.filter((obj) => {
    //         return obj.element1 === user.username;
    //       });

    //       arr.map((element) => socket.to(element.element2).emit("Gotmsg"));
    // })


    //new socket send msg, to be modified later
    socket.on("sendMessage", async ({messageContent, userId, receiverId, roomId}) => {
      const user = await this.prisma.user.findUnique({
        where: {
          id: receiverId,
        },
      });
      const arr = this.serv.myArray.filter((obj) => {
        return obj.element1 === user.username;
      });
      arr.forEach((element) => {
        socket.to(element.element2).emit("Getmsg", {
          userId,
          roomId,
          messageContent,
        });
      });
    })


    // socket.on("acceptReq", async (data) => {
    //     // console.log("hello you",socket.id)
    //     const isin = this.serv.myArray.find((obj) => {
    //       return obj.element2 === socket.id;
    //     });
    //     console.log(isin);
    //     if (!isin) {
    //       console.log("i saw it coming from miles away");
    //       return;
    //     }
    //     const user = await this.prisma.user.findUnique({
    //       where: {
    //         id: data,
    //       },
    //     });
    //     const arr = this.serv.myArray.filter((obj) => {
    //       return obj.element1 === user.username;
    //     });
  
    //     arr.map((element) => socket.to(element.element2).emit("acceptreq"));
    //   });

    // })
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
    const find = this.serv.myArray.find((obj) => {
      return obj.element2 === client.id;
    });
    console.log(find);
    // //find user in db using username
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          username: find.element1,
        },
      });
      //delet from array
      this.serv.myArray = this.serv.myArray.filter((obj) => {
        return obj !== find;
      });
      console.log("new array");
      console.log(this.serv.myArray);
      //   console.log("check number of user in array : ");
      const countUser = this.serv.myArray.filter((obj) => {
        return obj.element1 === find.element1;
      }).length;
      //   console.log(countUser);
      try {
        await this.prisma.user.update({
          where: {
            username: find.element1,
          },

          data: {
            profile: {
              update: {
                online: countUser == 0 ? false : true,
              },
            },
          },
        });
      } catch (e) {}
    } catch (e) {}
    // //count username in array  if 0 online ---> offline
    // //  try{
    // //      await this.prisma.user.update({
    // //          where:{
    // //             auth: client.id,
    // //          },

    // //          data:{

    // //              profile:{
    // //                  update:{
    // //                      online: false
    // //                  }
    // //              }
    // //          }

    // //      }
    // //      );
    // //     }
    // //     catch(e)
    // //     {}
    // console.log(this.serv.myArray);
    console.log(`Client disconnected: ${client.id}`);
  }
}
