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
    const user = await this.prisma.user.findUnique({
      where: {
        intrrid: user1.id
      }
    });
    if (!user) {
      return null;
    }
    const payload = {
      id: user1.id ,
      accestoken:  user1.mytoken["accestoken"],
      refreshtoken: user1.mytoken["refreshtoken"],
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signup(dto: AuthDto,cookie: any) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          auth: dto.auth,
          intrrid: cookie.id,
          image: dto.image,
          profile: {
                      create: {
                        image: dto.image,
                        username: dto.username,
                      }
                    }
        },
      });
      await this.prisma.inbox.create({
        data: {
          inboxOf: { connect: { id: user.id } },
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      if (e.code === "P2002") {
        throw new ForbiddenException("User already exist");
      }
      throw e;
    }
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
