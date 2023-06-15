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

@Injectable()
export class AuthService {

  constructor(private prisma: PrismaService,private readonly s42:  Strategy42, private jwtService: JwtService,private tokenService: TokenService) {
    // super({
    //   clientID: "u-s4t2ud-d2078e9c2d7ea34d37a5adffa013cee9c2715889268480c4eba8a13a93ec6469", // Replace with your 42 app ID
    //   clientSecret: "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", // Replace with your 42 app secret
    //   callbackURL: "http://127.0.0.1:3000/auth/42/callback",
    // });
  }

  // async validate(
  //   request: { session: { accessToken: string } },
  //   accessToken: string,
  //   refreshToken: string,
  //   profile: Profile,
  //   cb: VerifyCallback,
  // ): Promise<any> {
  //   request.session.accessToken = accessToken;
  //   console.log('accessToken', accessToken, 'refreshToken', refreshToken);
  //   // In this example, the user's 42 profile is supplied as the user
  //   // record.  In a production-quality application, the 42 profile should
  //   // be associated with a user record in the application's database, which
  //   // allows for account linking and authentication with other identity
  //   // providers.
  //   return cb(null, profile);
  // }
  // async login(dto: AuthDto) {
  //   console.log('in login');
  //   // const tmp = this.s42.validate(dto.token,dto.auth,dto,VerifyCallback);
  //   // console.log(tmp);
  //   console.log('in login2');
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email: dto.email,
  //     },
  //   });
  //   //if user does not exist hrow exception
  //   // if (!user) {
  //   //   throw new ForbiddenException("Credentials incorrect");
  //   // }
  //   const payload = {id: user.id ,
  //     data:dto,
  //     accestoken:  this.s42.tokens,
  //     refreshtoken: this.s42.refresh,
  //   };
  //   // console.log(this.s42.signAsync('dsdsdfsfds'));
    
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  //   // compare password
  //   // const pswdv = await prisma.verify(user.email,dto.email);
  //   // //if password incorrect throw exeption
  //   // if(!pswdv)
  //   // {
  //   //   throw new ForbiddenException(
  //   //     'Credentials incorrect',
  //   //   );
  //   // }
  //   // //send back the user
  //   // delete user.hash;
  //   // return user;
  // }
  async userfind(user1:any)
  {

    //  token:string;
    // token = this.s42.tokens;
    console.log("my token acc",user1.mytoken["accestoken"]);
    console.log("my token ref",user1.mytoken["refreshtoken"]);
    
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
