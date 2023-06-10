

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
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          friendsRelation: { connect: { id: friendId } },
        },
      });
    
    }
    async getFriendRequest(userId: number) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          envitOf: true
        },
      });
      return user.envitOf;
    }
    async getFriendsendRequest(userId: number) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          envitOf: true
        },
      });
      return user.envitOf;
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

    async  getprofile(id:number)
    {
      const profile = await this.prisma.profile.findUnique(
        {
          where:{
            id:id
          }
        }
      );
      return profile;
    }

     async inviteUser(userId, inviterId) {
      try {
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
            envit: { connect: { id: inviterId } },
          },
        });
    
        console.log(`User with ID ${updatedUser.id} has been invited by user with ID ${inviter.id}.`);
      } catch (error) {
        console.error(error);
      } finally {
        await this.prisma.$disconnect();
      }
    }
    
}