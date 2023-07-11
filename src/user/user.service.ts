import { Injectable, NotFoundException } from "@nestjs/common";
import { Exclude } from "class-transformer";
import { async } from "rxjs";
import { createConversationDto } from "src/dto/room/createConversationDto";
// import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";
import { MyObject } from "src/test";

// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomService: RoomsService
  ) {}
  async findByid(id: number) {
    // console.log("here");
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }

  myArray: MyObject[] = [];

  async getUserConversationInbox(userId: string) {
    let inbox11 = await this.prisma.user.findUnique({
      where: { intrrid: userId },
      include: {
        rooms: {
          where: {
            group: false,
          },
          select: {
            id: true,
            whoJoined: {
              where: {
                intrrid: {
                  not: userId,
                },
              },
              select: {
                id: true,
                username: true,
                image: true,
                profile: {
                  select: {
                    online: true,
                  },
                },
              },
            },
            messages: {
              select: {
                createdAt: true,
              },
            },
          },
        },
      },
    });
  
    let test: any[] = [];
    let i: number = 0;
  
    inbox11.rooms.map((room) => {
      test[i] = {
        roomId: room.id,
        receiverId: room.whoJoined.at(0).id,
        username: room.whoJoined.at(0).username,
        online: room.whoJoined.at(0).profile.online,
        image: room.whoJoined.at(0).image,
        createdAt: room.messages.length > 0 ? room.messages[room.messages.length - 1].createdAt : null,
      };
      i++;
    });
  
    // Sort the test array based on the createdAt property
    test.sort((a, b) => {
      if (a.createdAt === null) return 1; // Move conversations without messages to the end
      if (b.createdAt === null) return -1; // Move conversations without messages to the end
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  
    return test;
  }

  async addFriend(userId: string, friendId: number) {
   
    const data = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
      include: {
        friends: true,
      },
    });
    const profileuser = await this.prisma.profile.findUnique({
      where:{
        id:friendId
      }
    })
    const friend = await this.prisma.user.findUnique({
      where: {
        id: profileuser.Userid,
      },
    });

    const find = data.friends.find((obj) => {
      return obj.username === friend.username;
    });
    if (find) return null;
    const user = await this.prisma.user.update({
      where: { intrrid: userId },
      data: {
        friendsRelation: { connect: { id: profileuser.Userid } },
      },
    });
    await this.prisma.user.update({
      where: { id: profileuser.Userid },
      data: {
        friendsRelation: { connect: { intrrid: userId } },
        request: { disconnect: { id: profileuser.Userid } },
      },
    });
    await this.prisma.user.update({
      where: { intrrid: userId },
      data: {
        requestedBy: { disconnect: { id: profileuser.Userid } },
      },
    });
    const user1 = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
    });
    await this.roomService.createConversation(user1.id, profileuser.Userid);
    return friend;
  }
  ////////////////
  async getFriendRequest(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
      include: {
        requestedBy: {
        include:{
          profile: true
        }
      }
      },
      
    });
    await this.prisma.user.update({
      where:{
        intrrid: userId,
      },
      data:{
        notif: false
      }
    })
    return user.requestedBy.map((requestedBy) => requestedBy.profile); 
  }
  // async getFriendsendRequest(userId: number) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //     include: {
  //       request: true,
  //     },
  //   });
  //   return user.request;
  // }
  async updateusername(id: string, username: string) {
    const user = await this.prisma.user.update({
      where: {
        // id:id,
        intrrid: id,
      },
      data: {
        username: username,
        profile: {
          update: {
            username: username,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user;
  }
  async searchuser(username: string) {
    const result = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
        },
      },
    });
    return result;
  }
  async updateuserimage(id: string, image: string) {
    const user = await this.prisma.user.update({
      where: {
        intrrid: id,
      },
      data: {
        image: image,
        profile: {
          update: {
            image: image,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return user;
  }

  async getprofile(username: string, id: string) {
    try {
      const profile = await this.prisma.profile.findUniqueOrThrow({
        where: {
          username: username,
        },
      });
      const result = await this.prisma.user.findUniqueOrThrow({
        where: {
          intrrid: id,
        },
        include: {
          friends: true,
          request: true,
        },
      });
      //get user friends check if this user in frends and return obj have the statu and profile
      const found = result.friends.find((obj) => {
        return obj.username === username;
      });
      const foundreq = result.request.find((obj) => {
        return obj.username == username;
      });
      return {
        ...profile,
        friend: found ? "friend" : "",
        requestsent: foundreq ? "reqestsent" : "",
      };
    } catch (e) {
      throw new NotFoundException("404");
    }
  }

  async inviteUser(userId: number, inviterId: string) {
    const profile = await this.prisma.profile.findUnique({
      where:{
        id:userId
      }
    })
    const userToInvite = await this.prisma.user.findUnique({
      where: { id: profile.Userid },
      include: {
        requestedBy: true,
      },
    });
    try {
      const inviter = await this.prisma.user.findUnique({
        where: { intrrid: inviterId },
      });

      if (!inviter) {
        throw new Error(`Inviter user with ID ${inviterId} not found.`);
      }
      const found = userToInvite.requestedBy.find((obj) => {
        return obj.username === inviter.username;
      });
      if (found) return userToInvite;
      // Send the invite by updating the relationship
      const updatedUser = await this.prisma.user.update({
        where: { id: profile.Userid },
        data: {
          notif: true,
          requestedBy: { connect: { intrrid: inviterId } },

        },
      });
    } catch (error) {
      console.error(error);
    }
    return userToInvite;
  }
  /////////Remove from friends/////////
  async removefiend(id: number, myuserid: string) {
    const myuser = await this.prisma.user.findUnique({
      where: {
        intrrid: myuserid,
      },
    });
    const profile = await this.prisma.profile.findUnique({
      where:{
        id:id
      }
    })
    try {
      await this.prisma.user.update({
        where: {
          id: profile.Userid,
        },
        data: {
          friends: {
            disconnect: [{ intrrid: myuserid }],
          },
          friendsRelation: {
            disconnect: [{ intrrid: myuserid }],
          },
        },
        include: {
          friends: true,
        },
      });
      const room = await this.prisma.room.findFirst({
        where: {
          AND: [
            { whoJoined: { some: { id: myuser.id } } },
            { whoJoined: { some: { id: profile.Userid } } },
          ],
        },
        include: { whoJoined: true },
      });
      const room1 = await this.prisma.room.findUniqueOrThrow({
        where: { id: room.id },
        include: { messages: true, inbox: true },
      });
      // Delete the messages associated with the room
      await this.prisma.message.deleteMany({
        where: {
          createdBy: {
            id: myuser.id,
          },
        },
      });
      await this.prisma.message.deleteMany({
        where: {
          createdBy: {
            id: profile.Userid,
          },
        },
      });
      await this.prisma.room.delete({
        where: {
          id: room1.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  async rfriends(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        friends: true,
      },
    });
    return user.friends;
  }
  async cancelreqest(myuserid: string, userid: number) {
    try{
      const profileuser = await this.prisma.profile.findUnique({
        where:{
          id : userid
        }
      });
      const userf = await this.prisma.user.update({
        where: {
          id: profileuser.Userid,
        },
        data: {
          requestedBy: {
            disconnect: [{ intrrid: myuserid }],
          },
        },
        include: {
          requestedBy: true,
        },
      });
      await this.prisma.user.update({
        where: {
          intrrid: myuserid,
        },
        data: {
          request: {
            disconnect: [{ id: profileuser.Userid }],
          },
        },
        include: {
          request: true,
        },
      });
      return userf;
    }
    catch(e)
    {
      console.log(e)
    }
  }

  async deletreq(myuserid: string, userid: number) {
    const profileuser = await this.prisma.profile.findUnique({
      where:{
        id : userid
      }
    });
    const userf = await this.prisma.user.update({
      where: {
        id: profileuser.Userid,
      },
      data: {
        request: {
          disconnect: [{ intrrid: myuserid }],
        },
      },
      include: {
        request: true,
      },
    });
    await this.prisma.user.update({
      where: {
        intrrid: myuserid,
      },
      data: {
        requestedBy: {
          disconnect: [{ id: profileuser.Userid }],
        },
      },
      include: {
        requestedBy: true,
      },
    });
    return userf.auth;
  }
}
