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
  Res,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { use } from "passport";
import { MyGateway } from "src/getway/gateway";
import { Socket } from "socket.io";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly Mygiteway: MyGateway
  ) {}
  @Get("search")
  async Search(@Query("username") username: string) {
    if (username === "") return [];
    try {
      return this.userService.searchuser(username);
    } catch (e) {
      return { e: "no users" };
    }
  }

  @Get("accept")
  async addFriend(
    @Query("idfriend") userId: string, @Req() req: Request
  ) {
    try {
      const data = await this.jwtService.verifyAsync(
        req.cookies["authcookie"]["access_token"],

        {
          secret: jwtConstants.secret,
          ignoreExpiration: true,
        }
      );
      console.log("userid = ",userId);
      console.log("intara id = ",data.id);
      const numericId = parseInt(userId, 10);
      const user = await this.userService.addFriend(data.id,numericId);
      return { message: "Friend added successfully", user };
    } catch (error) {
      return { error: "Failed to add friend" };
    }
  }

  @Get("friends")
  async showfriends(@Query("id") id: string) {
    const numericId = parseInt(id, 10);
    console.log(numericId);
    return this.userService.rfriends(numericId);
  }

  @Get("myreq")
  async usersRequest(@Req() req: Request) {
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    return this.userService.getFriendRequest(data.id);
  }

  // @Get("sendreq")
  // usersEnvit(@Query("id") id: string) {
  //   const numericId = parseInt(id, 10);
  //   console.log("sendreq", numericId);
  //   return this.userService.getFriendsendRequest(numericId);
  // }
  @Get("invet")//
  async getUser(@Query("id") iduser: string, @Req() req: Request) {
    const numericId = parseInt(iduser, 10);
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    const user = this.userService.inviteUser(numericId, data.id);
    return true
  }
  @Get("cancel")
  async cancelreq(@Query("id") iduser: string, @Req() req: Request) {
    const numericId = parseInt(iduser, 10);
    
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],
      
      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
      );
    const user = this.userService.cancelreqest(data.id, numericId);
    return true
  }
  @Get("remove")
  async deletefromefriends(@Query("id") iduser: string,@Req() req: Request) {
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    const numericId = parseInt(iduser, 10);
    this.userService.removefiend(numericId, data.id); ///
    return true;
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
  @Get("showprofile")
  async showprofile(@Query("username") username: string, @Req() req: Request) {
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    return this.userService.getprofile(username, data.id);
  }

  @Get("/getUserConversationInbox/")
  async getUserInbox(@Req() req: Request) {
    console.log("here");
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],
      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    // getUserConversationInbox
    return this.userService.getUserConversationInbox(data.id);
  }
  @Get("deletreq")
  async deletreq(@Req() req: Request,@Query("id") iduser: string,)
  {
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    const numericId = parseInt(iduser, 10);
    this.userService.deletreq(data.id,numericId);
  }
  // @Delete(':uname')
  // removeUser(@Param('uname') uname : string)
  // {
  //     this.userService.deletuser(uname);
  //     return true;
  // }
}
