import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthDto } from "./dto";
import { PrismaService } from "src/prisma/prisma.service";
import { validate } from "class-validator";
import { Strategy42 } from "./fortytwo.strategy";
// import { VerifyCallback } from 'passport-42';
import { verify } from "crypto";
import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";
import { Strategy } from "passport-local";
import { Profile, use } from "passport";
import { VerifyCallback } from 'passport-42';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,private readonly s42:  Strategy42, private jwtService: JwtService) {
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
  async login(dto: AuthDto) {
    console.log('in login');
    // const tmp = this.s42.validate(dto.token,dto.auth,dto,VerifyCallback);
    // console.log(tmp);
    console.log('in login2');
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //if user does not exist hrow exception
    // if (!user) {
    //   throw new ForbiddenException("Credentials incorrect");
    // }
    const payload = {id: user.id ,
      data:dto,
      accestoken:  this.s42.tokens,
      refreshtoken: this.s42.refresh,
    };
    // console.log(this.s42.signAsync('dsdsdfsfds'));
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
    // compare password
    // const pswdv = await prisma.verify(user.email,dto.email);
    // //if password incorrect throw exeption
    // if(!pswdv)
    // {
    //   throw new ForbiddenException(
    //     'Credentials incorrect',
    //   );
    // }
    // //send back the user
    // delete user.hash;
    // return user;
  }
  async userfind()
  {

    //  token:string;
    // token = this.s42.tokens;
    console.log(this.s42.tokens);
    
    const user = await this.prisma.user.findFirst({
      where: {
        token: <string>this.s42.tokens
      }
    });
    // if user does not exist hrow exception
    if (!user) {
      console.log('hiiii');
      return null;
    }
    const payload = {id: user.id ,
      accestoken:  this.s42.tokens,
      refreshtoken: this.s42.refresh,
    };
    // console.log(this.s42.signAsync('dsdsdfsfds'));
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signup(dto: AuthDto) {
    console.log(dto);
    console.log(this.s42.user);
    console.log('wtf');
    // Save new user in the database
    try {
      const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            username: dto.username,
            auth: dto.auth,
            token: <string>this.s42.tokens,
            image: dto.image,
            profile: {
              create: {
                profilepicter: dto.image,
                username: dto.username,
                email: dto.email,
              }
            }
          },
      });
      return user;
    } catch (e) {
      // if (e instanceof PrismaClientKnownRequestError) {
      console.log("heeeere");
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
    const user = await this.prisma.user.findFirst({
      where : {
        id: id,
      }
    })
    return user;
  }
}
