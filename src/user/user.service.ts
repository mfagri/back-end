

import { Injectable, NotFoundException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

// import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService
{
    constructor(private readonly prisma: PrismaService)
    {

    }
    async findByid(id:number)
    {
      console.log('here');
        const user = await this.prisma.user.findUnique({
            where:{
                id: id
            }
        })
        return user;
    }
    async addFriend(userId: number, friendId: number){
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
      return user;
    }
    async getFriendRequest(userId: number) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          requestedBy: true
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
          request: true
        },
      });
      return user.request;
    }
    async updateusername(id: string,username: string)
    {

        
 
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
                include:{
                  profile: true
                }
              });

        return user;
    }
    async searchuser(username: string)
    {
      const result = await this.prisma.user.findMany({
        where: {
          username: {
            startsWith: username,
          },
          // posts: {
          //   some: {
          //     published: true,
          //   },
          // },
        },
        // include: {
        //   posts: {
        //     where: {
        //       published: true,
        //     },
        //   },
        // },
      })
      return result;
    }
    async updateuserimage(id: string,image: string)
    {
        
            
            const user = await this.prisma.user.update({
                where: {
                  intrrid:id,
                  
                },
                data: {
                  image: image,
                  profile: {
                    update: {
                      profilepicter: image,
                    },
                  },
                },
                include:{
                  profile: true
                }
              });

        return user;
    }

    async  getprofile(username: string)
    {
      try{

        const profile = await this.prisma.profile.findUniqueOrThrow(
          {
            where:{
              username: username,
            }
          }
        );
        return profile;
      }
      catch(e)
      {
        throw new NotFoundException('404');
      }
    }

     async inviteUser(userId:number, inviterId:number) {
      try {
        console.log(userId)
        console.log(inviterId)

        // Fetch the user to invite
        const userToInvite = await this.prisma.user.findUnique({
          where: { id: userId },
        });
    
        if (!userToInvite) {
          throw new Error(`User with ID ${userId} not found.`);
        }
    
        // Fetch the inviter user
        const inviter = await this.prisma.user.findUnique({
          where: { id: inviterId },
        });
    
        if (!inviter) {
          throw new Error(`Inviter user with ID ${inviterId} not found.`);
        }
    
        // Send the invite by updating the relationship
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            requestedBy: { connect: { id: inviterId } },
          },
        });
    
        console.log(`User with ID ${updatedUser.id} has been invited by user with ID ${inviter.id}.`);
      } catch (error) {
        console.error(error);
      } finally {
        await this.prisma.$disconnect();
      }
      return 'request sended';
    }
    async rfriends(id:number)
    {
      const user = await this.prisma.user.findUnique({
        where:{
          id:id,
        },
        include:{
          friends:true
        }
      });
      return user.friends
    }
}