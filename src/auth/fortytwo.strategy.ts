import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy as FortyTwoStrategy } from "passport-42";
import { Injectable, Req, Res, UnauthorizedException } from "@nestjs/common";
import { VerifyCallback } from 'passport-42';


@Injectable()
export class Strategy42 extends PassportStrategy(FortyTwoStrategy) {
  tokens: String;
  refresh: String;
  constructor() {
    super({
      clientID:
        "u-s4t2ud-d2078e9c2d7ea34d37a5adffa013cee9c2715889268480c4eba8a13a93ec6469",
      clientSecret:
        "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",
      callbackURL: "http://localhost:5000/auth/callback",
      scope: 'public',
    });
  }
  async validate(
    accessToken: String,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
    // @Req() req: Request,
  ) {
    if (!accessToken) {
      throw new UnauthorizedException("Access token missing");
    } 
    // this.Id = profile.id;
    this.tokens = accessToken;
    this.refresh = refreshToken;


    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    this.usr1 = user;
    const payload = {
      accestoken:  accessToken,
      refreshtoken: refreshToken,
    };
    console.log("/////", payload, "//////");
    // done(null,profile)
    return payload;
  }
  // private static extract42(req: any): string | null {
  //   if (req.cookies && 'access_token' in req.cookies) {
  //     return req.cookies.access_token;
  //   }
  //   return null;
  // }
}
