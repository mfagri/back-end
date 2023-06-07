

import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

// import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService
{
    constructor(private readonly prisma: PrismaService)
    {

    }
    async findByid(username:string)
    {
        const user = await this.prisma.user.findFirst({
            where:{
                username: username
            }
        })
        return user;
    }
    async updateusername(id: number,username: string)
    {
        
 
            const user = await this.prisma.user.update({
                where: {
                  id: id, // Replace with the actual ID of the user you want to update
                },
                data: {
                  username: username, // Update the username property
                },
              });

        return user;
    }

    async updateuserimage(id: number,image: string)
    {
        
 
            const user = await this.prisma.user.update({
                where: {
                  id: id, // Replace with the actual ID of the user you want to update
                },
                data: {
                  image: image, // Update the username property
                },
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
}