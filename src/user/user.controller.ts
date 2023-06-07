import { Controller,Post,Body, Get,Param,Patch,Delete, Query} from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

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
    updateUser(
        @Query('id') id: string,
        @Body('username') uname : string,
        @Body('image') image : string,
    ){
        console.log(id);

        // const User = this.userService.findByid(username);
        const numericId = parseInt(id, 10);
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

    // @Delete(':uname')
    // removeUser(@Param('uname') uname : string)
    // {
    //     this.userService.deletuser(uname);
    //     return true;
    // }
}