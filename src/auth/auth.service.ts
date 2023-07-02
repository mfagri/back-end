import {
    ForbiddenException,
    Injectable
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "../dto/auth";
import { Strategy42 } from "./fortytwo.strategy";
// import { VerifyCallback } from 'passport-42';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from "./token.sever";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService,private readonly s42:  Strategy42, private jwtService: JwtService,private tokenService: TokenService,private readonly mailerService: MailerService) {

  }

  async userfind(user1:any)
  {

    //  token:string;
    // token = this.s42.tokens;
    // console.log("my token acc",user1.mytoken["accestoken"]);
    // console.log("my token ref",user1.mytoken["refreshtoken"]);
    
    const user = await this.prisma.user.findUnique({
      where: {
        intrrid: user1.id
      }
    });
    // if user does not exist hrow exception
    if (!user) {
      return null;
    }
    // id: '93909',
    // mytoken: {
    //   accestoken: '177a6c3c1c3d15f80f7d375bfaa9e1315bc549cccfa56515a4ccdbcabf7b5756',
    //   refreshtoken: '21589e5b16809dd820d01cea599e7ae6db79b586450e9843a4dec4e4bcafb81b'
    // }
    const payload = {
      id: user1.id ,
      accestoken:  user1.mytoken["accestoken"],
      refreshtoken: user1.mytoken["refreshtoken"],
    };
    // console.log(this.s42.signAsync('dsdsdfsfds'));
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  // async signup(dto: AuthDto) {
  //   console.log(dto);
  //   // Save new user in the database
  //   try {
  //     const user = await this.prisma.user.create({
  //       data: {
  //         email: dto.email,
  //         username: dto.username,
  //         auth: dto.auth,
  //         token: this.s42.tokens,
  //         image: dto.image,
  //         profile: {
  //           create: {
  //             profilepicter: dto.image,
  //             username: dto.username,
  //             email: dto.email,
  //           }
  //         }
  //       },
  //   });
  //     // const profile = await this.prisma.profile.create({
  //     //   data:{
  //     //     username: dto.username,
  //     //     profilepicter: dto.image,
  //     //   }
  //     // })
  //     // delete user.hash;
  //     // Return the saved user
  //     return user;
  //   } catch (e) {
  //     // if (e instanceof PrismaClientKnownRequestError) {
  //     console.log("heeeere");
  //     if (e.code === "P2002") {
  //       throw new ForbiddenException("User already exist");
  //     }
  //     // }

  //     // Throw the original error if it's not a known request error
  //     throw e;
  //   }
  //   // return 'signup';
  // }
  async signup(dto: AuthDto,cookie: any) {
      // {
    //   id: '93909',
    //   mytoken: {
    //     accestoken: '177a6c3c1c3d15f80f7d375bfaa9e1315bc549cccfa56515a4ccdbcabf7b5756',
    //     refreshtoken: '21589e5b16809dd820d01cea599e7ae6db79b586450e9843a4dec4e4bcafb81b'
    //   }
    // }
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          auth: dto.auth,
          intrrid: cookie.id,
          image: dto.image,
          profile: {
                      create: {
                        image: dto.image,
                        username: dto.username,
                        email: dto.email,
                      }
                    }
        },
      });
      await this.prisma.inbox.create({
        data: {
          inboxOf: { connect: { id: user.id } },
        },
      });
      // delete user.hash;
      // Return the saved user
      return user;
    } catch (e) {
      // if (e instanceof PrismaClientKnownRequestError) {
      console.log(e);
      if (e.code === "P2002") {
        throw new ForbiddenException("User already exist");
      }
      // }

      // Throw the original error if it's not a known request error
      throw e;
    }
    // return 'signup';
  }
  async findone(id: number)
  {
    const user = await this.prisma.user.findUnique({
      where : {
        intrrid: id.toString(),
      }
    })
    return user;
  }
}
