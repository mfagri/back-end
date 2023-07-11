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
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { use } from "passport";
import { MyGateway } from "src/getway/gateway";
import { Socket } from "socket.io";
import { AuthGuardJWS } from "src/auth/auth.guard";

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
  @UseGuards(AuthGuardJWS)
  async addFriend(
    @Query("idfriend") userId: string, @Req() req: any
  ) {
    try {
      const numericId = parseInt(userId, 10);
      const user = await this.userService.addFriend(req.user.id,numericId);
      return { message: "Friend added successfully", user };
    } catch (error) {
      return { error: "Failed to add friend" };
    }
  }

  @Get("friends")
  async showfriends(@Query("id") id: string) {
    const numericId = parseInt(id, 10);
    return this.userService.rfriends(numericId);
  }

  @Get("myreq")
  @UseGuards(AuthGuardJWS)
  async usersRequest(@Req() req: any) {
    return this.userService.getFriendRequest(req.user.id);
  }

  // @Get("sendreq")
  // usersEnvit(@Query("id") id: string) {
  //   const numericId = parseInt(id, 10);
  //   console.log("sendreq", numericId);
  //   return this.userService.getFriendsendRequest(numericId);
  // }
  @Get("invet")//
  @UseGuards(AuthGuardJWS)
  async getUser(@Query("id") iduser: string, @Req() req: any) {
    const numericId = parseInt(iduser, 10);
    this.userService.inviteUser(numericId, req.user.id);
    return true
  }
  @Get("cancel")
  @UseGuards(AuthGuardJWS)
  async cancelreq(@Query("id") iduser: string, @Req() req: any) {
    const numericId = parseInt(iduser, 10);
    this.userService.cancelreqest(req.user.id, numericId);
    return true
  }
  @Get("remove")
  @UseGuards(AuthGuardJWS)
  async deletefromefriends(@Query("id") iduser: string,@Req() req: any) {
    const numericId = parseInt(iduser, 10);
    this.userService.removefiend(numericId, req.user.id); ///
    return true;
  }

  @Patch()
  @UseGuards(AuthGuardJWS)
  async updateUser(
    @Req() req: any,
    @Body("username") uname: string,
    @Body("image") image: string
  ) {
    try {
      if (uname && image) {
        this.userService.updateusername(req.user.id, uname);
        return this.userService.updateuserimage(req.user.id, image);
      } else if (uname) return this.userService.updateusername(req.user.id, uname);
      else if (image) return this.userService.updateuserimage(req.user.id, image);
    } catch (e) {
      throw new ForbiddenException("no user here");
    }
  }
  @Get("showprofile")
  @UseGuards(AuthGuardJWS)
  async showprofile(@Query("username") username: string, @Req() req: any) {
    return this.userService.getprofile(username, req.user.id);
  }

  @Get("/getUserConversationInbox/")
  @UseGuards(AuthGuardJWS)
  async getUserInbox(@Req() req: any) {
    return this.userService.getUserConversationInbox(req.user.id);
  }
  @Get("deletreq")
  @UseGuards(AuthGuardJWS)
  async deletreq(@Req() req: any,@Query("id") iduser: string,)
  {
    const numericId = parseInt(iduser, 10);
    this.userService.deletreq(req.user.id,numericId);
  }
  // @Delete(':uname')
  // removeUser(@Param('uname') uname : string)
  // {
  //     this.userService.deletuser(uname);
  //     return true;
  // }
}
