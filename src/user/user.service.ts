import { Injectable, NotFoundException } from "@nestjs/common";
import { createConversationDto } from "src/dto/room/createConversationDto";
// import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsService } from "src/rooms/rooms.service";

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
  async getUserConversationInbox(userId: string) {
    let inbox = await this.prisma.user.findUnique({
      where: { intrrid: userId },
      select: {
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
                username: true,
                image: true,
                id: true,
              },
            },
            messages: {
              select: {
                createdAt: true,
                createdBy: {
                  select: {
                    username: true,
                    id: true,
                  },
                },
                content: true,
              },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });
    const check_inbox = await this.prisma.user.findUnique({
      where: { intrrid: userId },
      select: {
        rooms: {
          select: {
            group: true,
            whoJoined: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    if (!check_inbox)
      throw new NotFoundException("No inbox found for this user");

    for (let i = 0; i < check_inbox.rooms.length; i++) {}
    return inbox;
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

  async addFriend(userId: number, friendId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        friendsRelation: { connect: { id: friendId } },
      },
    });
    await this.prisma.user.update({
      where: { id: friendId },
      data: {
        friendsRelation: { connect: { id: userId } },
      },
    });
    await this.roomService.createConversation(userId, friendId);
    return user;
  }

  // async addFriend(userId: string, friendId: number) {
  //   const user = await this.prisma.user.update({
  //     where: { intrrid: userId },
  //     data: {
  //       friendsRelation: { connect: { id: friendId } },
  //     },
  //   });
  //   await this.prisma.user.update({
  //     where: { id: friendId },
  //     data: {
  //       friendsRelation: { connect: { intrrid: userId } },
  //       request: {disconnect:{id:friendId}}
  //     },
  //   });
  //   await this.prisma.user.update({
  //     where: { intrrid: userId },
  //     data: {
  //       // friendsRelation: { connect: { intrrid: userId } },
  //       requestedBy: {disconnect:{id:friendId}}
  //     },
  //   });
  //   // data: {
  //   //   requestedBy: { connect: { intrrid: inviterId } },
  //   // },
  //   const user1 = await this.prisma.user.findUnique({
  //     where:{
  //       intrrid:userId
  //     }
  //   })
  //   await this.roomService.createConversation(user1.id, friendId);
  //   return user;
  // }
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
    try {
      console.log(userId);
      console.log(inviterId);

      // Fetch the user to invite
      const userToInvite = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userToInvite) {
        throw new Error(`User with ID ${userId} not found.`);
      }

      // Fetch the inviter user
      const inviter = await this.prisma.user.findUnique({
        where: { intrrid: inviterId },
      });

      if (!inviter) {
        throw new Error(`Inviter user with ID ${inviterId} not found.`);
      }

      // Send the invite by updating the relationship
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          requestedBy: { connect: { intrrid: inviterId } },
        },
      });

      console.log(
        `User with ID ${updatedUser.username} has been invited by user with ID ${inviter.username}.`
      );
    } catch (error) {
      console.error(error);
    } finally {
      await this.prisma.$disconnect();
    }
    return true;
  }
  /////////Remove from friends/////////
  async removefiend(id: number, myuserid: string) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        friends: {
          disconnect: [{ intrrid: myuserid }],
        },
      },
      include: {
        friends: true,
      },
    });
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
    await this.prisma.user.update({
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
    return true;
  }
}
