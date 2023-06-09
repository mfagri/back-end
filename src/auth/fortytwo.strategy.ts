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
      Profile:{
        
      }
    });
  }
  async validate(
    accessToken: String,
    refreshToken: string,
    profile: Profile,
  ) {
    if (!accessToken) {
      throw new UnauthorizedException("Access token missing");
    } 
    this.tokens = accessToken;
    this.refresh = refreshToken;


    const user = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    const payload = {
      accestoken:  accessToken,
      refreshtoken: refreshToken,
    };
    return {id: profile.id,mytoken: payload}
  }
}
