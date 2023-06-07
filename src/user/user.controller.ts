import { Controller,Post,Body, Get,Param,Patch,Delete, Query, Req, ForbiddenException} from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService,private jwtService: JwtService){}

    // // @Post()
    // @Post()
    // // async addUser(@Body() user: User): Promise<{ userid: number }> {
    // //   const { name, password } = user;
    // //   const id = await this.userService.insertUser(name, password);
    // //   return { userid: id };
    // // }
    // addUser(
    //     @Body('uname') name: string,
    //     // @Body('lastname') lastname: string,
    //     @Body('password') password: string,
    //     @Body() data
    //     )
    //     {
    //     // console.log('hello');
    //     const id = this.userService.insertUser(name,password);
    //     return {userid: id};
    // }
    @Get()
    users(@Query('id') id:string,)
    {
        const numericId = parseInt(id, 10);
        console.log(numericId);
        return this.userService.getprofile(numericId);
    }
    // @Get(':uname')
    // getUser(@Param('uname') name : string,)
    // {
    //     console.log(name);
    //     return this.userService.getSingleUser(name);
    // }
    // @Post()
    // getUserlog(@Param('uname') name: string)
    // {
    //     console.log(name);
    //     return this.userService.getSingleUser(name);
    // }
    @Patch()
    async updateUser(
        @Req() req:Request,
        @Body('username') uname : string,
        @Body('image') image : string,
    ){
        
        try{
            const data = await this.jwtService.verifyAsync(req.cookies['authcookie']['access_token']
            
            ,
            {
              secret: jwtConstants.secret,
              ignoreExpiration: true,
            }
            
            );
           
            const numericId = parseInt(data.id, 10);
            if(uname && image)
            {
                this.userService.updateusername(numericId,uname);
                return this.userService.updateuserimage(numericId,image)
            }
            else if(uname)
                return this.userService.updateusername(numericId,uname);
            else if(image)
                return this.userService.updateuserimage(numericId,image)
          }
          catch(e)
          {
            throw new ForbiddenException('no user here');
          }
        // const User = this.userService.findByid(username);
    }

    // @Delete(':uname')
    // removeUser(@Param('uname') uname : string)
    // {
    //     this.userService.deletuser(uname);
    //     return true;
    // }
}

