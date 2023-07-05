import { Body, Controller, ForbiddenException, Get, Post, Query, Req, Request, Res, Session, UseGuards } from '@nestjs/common';
import { AuthDto } from '../dto/auth';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
// import { Strategy } from 'passport-42';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthGuard42 } from './auth.guard42';
import { jwtConstants } from './constants';
import {Server, Socket} from "socket.io"
import {generatsecret,getqrcode,validepass} from '../2FA/index';
const App = require('express')


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}
  // @Post('login')
  // login(@Body() dto: AuthDto) {
  //   return this.authService.login(dto);
  // }
  @Get('2FA')
  async googleauth()
  {
    return await getqrcode(generatsecret("2FA"))
  }
  @Post('2FA')
  verfey(@Body()data: {secret:string; code:string})
  {
    console.log(data);
    var s = validepass(data.secret,data.code)
    return s;
  }
  @Post('signup')
  async signup(@Req() req ,@Body() dto: AuthDto,@Query() q,) {
    // {
        console.log(dto);
    //   id: '93909',
    //   mytoken: {
    //     accestoken: '177a6c3c1c3d15f80f7d375bfaa9e1315bc549cccfa56515a4ccdbcabf7b5756',
    //     refreshtoken: '21589e5b16809dd820d01cea599e7ae6db79b586450e9843a4dec4e4bcafb81b'
    //   }
    // }

    // if(dto.auth === true)
    // {
    //   ///verfy
    // }
    // console.log(await getqrcode(generatsecret(dto.username)))
    // console.log(dto.auth)
      return this.authService.signup(dto,req.cookies['authcookie']);
  }
  
  // console.log()
  // @UseGuards(AuthGuard42)
  @Get('profile')
  // @UseGuards(AuthGuardJWS)
  async getProfile(@Req() req,@Session() a) { 
    a.authenticated = true;
    try{
      const data = await this.jwtService.verifyAsync(req.cookies['authcookie']['access_token']
      
        
      ,
      {
        secret: jwtConstants.secret,
        
        // ignoreExpiration: true,
      }
      
      );
      return this.authService.findone(data.id);
    }
    catch(e)
    {
      throw new ForbiddenException('no user here');
    }
    // console.log(data);
  }
  @UseGuards(AuthGuard42)
  
  @Get('42')//42
  async fortyTwoAuth(){
    console.log('42 login');
  }
  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('authcookie', { expires: new Date() })
    // res.redirect('/');

    // res.cookie('authcookie', '', { expires: new Date() });
  }

  @UseGuards(AuthGuard42)
  // @UseGuards(AuthGuard('42')) // Replace '42' with the appropriate strategy name
  @Get('/callback')
  async fortyTwoAuthRedirect(@Session() a ,@Request() req, @Res() res: Response) {
    a.authenticated = true;
    const user = await this.authService.userfind(req.user);//user

    res.cookie('authcookie',req.user, {
    });
    if(!user)
    {
      return res.redirect('http://localhost:3000/register');
    }
    else
    {
      res.cookie('authcookie',user);
      return res.redirect('http://localhost:3000/')
    }
  }
}
