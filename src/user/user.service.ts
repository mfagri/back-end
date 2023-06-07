

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
                  // id:id,
                  id:id,
                   
                },
                data: {
                  username: username, 
                },
              });

        return user;
    }

    async updateuserimage(id: number,image: string)
    {
        
            
            const user = await this.prisma.user.update({
                where: {
                  id:id,
                  
                },
                data: {
                  image: image, 
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