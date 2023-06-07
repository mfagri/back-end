import { PassportStrategy } from "@nestjs/passport";
import {  Profile, Strategy as FortyTwoStrategy } from "passport-42";
import { ConsoleLogger, Global, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { VerifyCallback } from 'passport-42';

@Injectable()
export class Strategy42 extends PassportStrategy(FortyTwoStrategy) {
  tokens  :  String;
  refresh : String;
  constructor() {
    super({
      clientID:
        "u-s4t2ud-d2078e9c2d7ea34d37a5adffa013cee9c2715889268480c4eba8a13a93ec6469",
      clientSecret:
        "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",
      callbackURL: "http://localhost:5000/auth/callback",
      
    });
  }

  async validate(accessToken: String, refreshToken: string , profile: Profile,done: VerifyCallback){
    // console.log(accessToken);
    // console.log(refreshToken);
    console.log("called");
    this.tokens = accessToken;
    this.refresh = refreshToken;
    console.log(profile.id);
    const {email,username,image} = profile;
    const user = {
      // email: email,
      username: username,
      // image: image,
      accessToken: accessToken,
      refreshToken: refreshToken

    }
    console.log(user);
    done(null,user)
    // console.log(profile);
  }
  signAsync(accessToken: String,refreshToken: string,payload: string){
    return 'dsdsds';
  }
  // private static extract42(req: any): string | null {
  //   if (req.cookies && 'access_token' in req.cookies) {
  //     return req.cookies.access_token;
  //   }
  //   return null;
  // }
}
