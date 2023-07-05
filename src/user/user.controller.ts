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

  // @Get("accept")
  // async addFriend(
  //   @Query("id") userId: string,
  //   @Query("idfriend") friendId: string
  // ): Promise<any> {
  //   try {
  //     console.log(userId);
  //     console.log(friendId);
  //     const numericId = parseInt(userId, 10);
  //     const numericId2 = parseInt(friendId, 10);
  //     const user = await this.userService.addFriend(numericId, numericId2);
  //     return { message: "Friend added successfully", user };
  //   } catch (error) {
  //     return { error: "Failed to add friend" };
  //   }
  // }
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
      // const numericId2 = parseInt(friendId, 10);
      const user = await this.userService.addFriend(data.id,numericId);
      // socket : Socket;
      // this.Mygiteway.socket1.to(user.auth).emit("acceptreq");
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
    // const numericId = parseInt(id, 10);
    // console.log(numericId);
    return this.userService.getFriendRequest(data.id);
  }
  @Get("sendreq")
  usersEnvit(@Query("id") id: string) {
    const numericId = parseInt(id, 10);
    console.log("sendreq", numericId);
    return this.userService.getFriendsendRequest(numericId);
  }
  @Get("invet")
  async getUser(@Query("id") iduser: string, @Req() req: Request) {
    const numericId = parseInt(iduser, 10);
    // const numericId2 = parseInt(idfriend, 10);
    const data = await this.jwtService.verifyAsync(
      req.cookies["authcookie"]["access_token"],

      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      }
    );
    // this.Mygiteway.sendmsg();
    // this.Mygiteway.onModuleInit();
    const user = this.userService.inviteUser(numericId, data.id);
  
    // const nameof = (await user).username
    // const arr = this.userService.myArray.filter((obj) => {
    // return (  obj.element1 === nameof )
    // } )
    // // console.log("arr = ",arr);
    // arr.map((element)=>  {
    //   // console.log(element);
    //   this.Mygiteway.socket1.to((element.element2).toString()).emit("receiveNotif")} )
      // this.Mygiteway.socket1.disconnect()
    // this.Mygiteway.socket1.connected
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
    //   const nameof = ((await user).username)
    //   console.log("id socket is = ",nameof);
    //   console.log("first arr:",this.userService.myArray)
    //   console.log("naaame: ",nameof);
    //   const arr = this.userService.myArray.filter((obj) => {
    //     return (  obj.element1 === nameof )
    //   } )
    //   console.log("arr =  ", arr)
    // // console.log("arr = ",arr);
    // arr.map((element)=>  
    //   // console.log(element);
    //   this.Mygiteway.socket1.to((element.element2)).emit("cancelreq")
    //   )
    // this.Mygiteway.socket1.disconnect()
    // this.Mygiteway.socket1.connected
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

  // @Get("/getUserConversationInbox/:id")
  // async getUserInbox(@Param("id", ParseIntPipe) id: number) {
  //   return this.userService.getUserConversationInbox(id);
  // }
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
