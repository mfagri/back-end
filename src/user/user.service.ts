

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
}