import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Req,
  ForbiddenException,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { use } from "passport";
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {}
  @Get("search")
  async Search(@Query("username") username: string) {
    
    if(username === '')
      return [];
    try {
      return this.userService.searchuser(username);
    } catch (e) {
      return { e: "no users" };
    }
  }
  @Get("accept")
  async addFriend(
    @Query("id") userId: string,
    @Query("idfriend") friendId: string
  ): Promise<any> {
    try {
      console.log(userId);
      console.log(friendId);
      const numericId = parseInt(userId, 10);
      const numericId2 = parseInt(friendId, 10);
      const user = await this.userService.addFriend(numericId, numericId2);
      return { message: "Friend added successfully", user };
    } catch (error) {
      return { error: "Failed to add friend" };
    }
  }
  @Get("friends")
  async showfriends(@Query("id") id: string)
  {
    const numericId = parseInt(id, 10);
    console.log(numericId);
      return this.userService.rfriends(numericId);
  }
  @Get("myreq")
  usersRequest(@Query("id") id: string) {
    const numericId = parseInt(id, 10);
    console.log(numericId);
    return this.userService.getFriendRequest(numericId);
  }
  @Get("sendreq")
  usersEnvit(@Query("id") id: string) {
    const numericId = parseInt(id, 10);
    console.log("sendreq", numericId);
    return this.userService.getFriendsendRequest(numericId);
  }
  @Get("invet")
  getUser(@Query("id") iduser: string, @Query("idfriend") idfriend: string) {
    const numericId = parseInt(iduser, 10);
    const numericId2 = parseInt(idfriend, 10);
    return this.userService.inviteUser(numericId, numericId2);
  }


  @Patch()
  async updateUser(
    @Req() req: Request,
    @Body("username") uname: string,
    @Body("image") image: string
  ) {
    try {
      const data = await this.jwtService.verifyAsync(
        req.cookies["authcookie"]["access_token"],

        {
          secret: jwtConstants.secret,
          ignoreExpiration: true,
        }
      );
      if (uname && image) {
        this.userService.updateusername(data.id, uname);
        return this.userService.updateuserimage(data.id, image);
      } else if (uname) return this.userService.updateusername(data.id, uname);
      else if (image) return this.userService.updateuserimage(data.id, image);
    } catch (e) {
      throw new ForbiddenException("no user here");
    }
  }
  @Get('showprofile')
  showprofile(@Query("username") username: string)
  {
   return this.userService.getprofile(username)
  }
  // @Delete(':uname')
  // removeUser(@Param('uname') uname : string)
  // {
  //     this.userService.deletuser(uname);
  //     return true;
  // }
}
