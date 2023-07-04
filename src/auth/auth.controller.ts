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
import {generatsecret,getqrcode} from '../2FA/index';
const App = require('express')


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}
  // @Post('login')
  // login(@Body() dto: AuthDto) {
  //   return this.authService.login(dto);
  // }
  @Post('2FA')
  async googleauth(@Body() dto: AuthDto)
  {
    return await getqrcode(generatsecret(dto.username))
  }
  // @Get('2FA')
  // verfey(@Query('id') q)
  // {

  // }
  @Post('signup')
  async signup(@Req() req ,@Body() dto: AuthDto,@Query() q,) {
    // {
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
    console.log(await getqrcode(generatsecret(dto.username)))
    // console.log(dto.auth)
      return this.authService.signup(dto,req.cookies['authcookie']);
  }
  
  // console.log()
  // @UseGuards(AuthGuard42)
  @Get('profile')
  // @UseGuards(AuthGuardJWS)
  async getProfile(@Req() req,@Session() a) { 
    console.log("sasa");
    a.authenticated = true;
    // console.log(req)
    // this.authService÷
    console.log("in profile we see this sheat",req.cookies['authcookie']);
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
    // if user exist
    console.log("i get this",req.user);
    a.authenticated = true;
      //42=>req.user{acc& ref} =>req.usrif login else signup 
    console.log("========",req.user.id)
    const user = await this.authService.userfind(req.user);//user
    console.log(user);
    console.log("here");
    res.cookie('authcookie',req.user, {
      // httpOnly: true,
      // secure: true,
    });
    if(!user)
    {
      console.log('go to register page');
      return res.redirect('http://localhost:3000/register');
    }
    else
    {
      res.cookie('authcookie',user);
      // // console.log(res);
      return res.redirect('http://localhost:3000/')
    }
    // console.log(user);
    // const cookie = req.cookies
    // console.log(cookie)
  }
}
