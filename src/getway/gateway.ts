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
  handleConnection(socket: any) {
    console.log("Incoming Connection", socket.id);
    socket.on("newUser", async (data) => {
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
      } catch (e) {
        console.log(e);
      }
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
      const arr = this.serv.myArray.filter((obj) => {
        return obj.element1 === user.username;
      });

      arr.map((element) => socket.to(element.element2).emit("receiveNotif"));
    });

    socket.on("cancelReq", async (data) => {
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
  }
  async handleDisconnect(client: Socket) {
    const find = this.serv.myArray.find((obj) => {
      return obj.element2 === client.id;
    });
    console.log(find);
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          username: find.element1,
        },
      });
      this.serv.myArray = this.serv.myArray.filter((obj) => {
        return obj !== find;
      });
      console.log("new array");
      console.log(this.serv.myArray);
      const countUser = this.serv.myArray.filter((obj) => {
        return obj.element1 === find.element1;
      }).length;
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
    console.log(`Client disconnected: ${client.id}`);
  }
}
