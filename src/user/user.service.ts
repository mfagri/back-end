import { Injectable, NotFoundException } from "@nestjs/common";
import { Exclude } from "class-transformer";
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
    console.log("here");
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
  
  // async getUserConversationInbox(userId: string) {
  //   let inbox = await this.prisma.user.findUnique({
  //     where: {intrrid: userId},
  //     select: {
  //       rooms: {
  //         where: {
  //           group: false,
  //         },
  //         select: {
  //           id: true,
  //           whoJoined: {
  //             where :{
  //               intrrid: {
  //                 not: userId,
  //               }
  //             },
  //             select: {
  //               username: true,
  //               image: true,
  //               id: true,
  //             }
  //           },
  //           messages: {
  //             select: {
  //               createdAt: true,
  //               createdBy: {
  //                 select: {
  //                   username: true,
  //                   id: true,
  //                 }
  //               },
  //               content: true,
  //             },
  //             orderBy: {
  //               createdAt: "desc"
  //             },
  //             take: 1,
  //           }
  //         }
  //       }
  //     }
  //   })
  //   const check_inbox = await this.prisma.user.findUnique({
  //     where: {intrrid: userId},
  //     select: {
  //       rooms: {
  //         select: {
  //           group: true,
  //           whoJoined: {
  //             select: {
  //               image: true,
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })

  //   if (!check_inbox)
  //     throw new NotFoundException("No inbox found for this user");

  //   for (let i = 0; i < check_inbox.rooms.length; i++) {
  //   }
  //   return inbox;
  // }

  // async addFriend(userId: number, friendId: number) {
  //   const user = await this.prisma.user.update({
  //     where: { id: userId },
  //     data: {
  //       friendsRelation: { connect: { id: friendId } },
  //     },
  //   });
  //   await this.prisma.user.update({
  //     where: { id: friendId },
  //     data: {
  //       friendsRelation: { connect: { id: userId } },
  //     },
  //   });
  //   await this.roomService.createConversation(userId, friendId);
  //   return user;
  // }

  async addFriend(userId: string, friendId: number) {
    const data = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
      include: {
        friends: true,
      },
    });
    const friend = await this.prisma.user.findUnique({
      where: {
        id: friendId,
      },
    });

    const find = data.friends.find((obj) => {
      return obj.username === friend.username;
    });
    if (find) return null;
    const user = await this.prisma.user.update({
      where: { intrrid: userId },
      data: {
        friendsRelation: { connect: { id: friendId } },
      },
    });
    await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friendsRelation: { connect: { intrrid: userId } },
        request: { disconnect: { id: friendId } },
      },
    });
    await this.prisma.user.update({
      where: { intrrid: userId },
      data: {
        // friendsRelation: { connect: { intrrid: userId } },
        requestedBy: { disconnect: { id: friendId } },
      },
    });
    // data: {
    //   requestedBy: { connect: { intrrid: inviterId } },
    // },
    const user1 = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
    });
    await this.roomService.createConversation(user1.id, friendId);
    return friend;
  }
  ////////////////
  async getFriendRequest(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        intrrid: userId,
      },
      include: {
        requestedBy: true,
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
    return user.requestedBy;
  }
  async getFriendsendRequest(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        request: true,
      },
    });
    return user.request;
  }
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
      // include: {
      //   friends: true
      // },
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
      // if (found)
      //   return {
      //     ...profile,
      //     friend: "friend",
      //   };
      // else
      //   return {
      //     ...profile,
      //     friend: "",
      //   };
      console.log("here", foundreq);
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
    console.log("hnaaaaaaaaa");
    console.log(this.myArray);
    const userToInvite = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        requestedBy: true,
      },
    });
    try {
      // console.log(userId);
      // console.log(inviterId);

      // if (!userToInvite) {
      //   throw new Error(`User with ID ${userId} not found.`);
      // }

      const inviter = await this.prisma.user.findUnique({
        where: { intrrid: inviterId },
      });

      // if (!inviter) {
      //   throw new Error(`Inviter user with ID ${inviterId} not found.`);
      // }
      const found = userToInvite.requestedBy.find((obj) => {
        return obj.username === inviter.username;
      });
      if (found) return userToInvite;
      // Send the invite by updating the relationship
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
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

    try {
      await this.prisma.user.update({
        where: {
          id: id,
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
            { whoJoined: { some: { id: id } } },
          ],
        },
        include: { whoJoined: true },
      });
      // rooms: [ { id: 10, whoJoined: [Array] }, { id: 11, whoJoined: [Array] } ]

      console.log("room id is === ", room);
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
            id: id,
          },
        },
      });
      // Delete the inbox entries associated with the room
      // await this.prisma.inbox.deleteMany(
      //   {
      //     where:{
      //       rooms:{

      //       }
      //     }
      //   }
      // );

      // // Delete the room itself
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
    const userf = await this.prisma.user.update({
      where: {
        id: userid,
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
          disconnect: [{ id: userid }],
        },
      },
      include: {
        request: true,
      },
    });
    return userf;
  }
  async deletreq(myuserid: string, userid: number) {
    const userf = await this.prisma.user.update({
      where: {
        id: userid,
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
          disconnect: [{ id: userid }],
        },
      },
      include: {
        requestedBy: true,
      },
    });
    return userf.auth;
  }
}
