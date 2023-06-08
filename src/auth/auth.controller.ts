import { Controller, Get, Post, Body, Param, UseGuards, Req, Redirect, Res, ForbiddenException, Patch, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { AuthGuardJWS } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { Strategy } from 'passport-42';
import { AuthGuard42 } from './auth.guard42';
import { Response } from 'express';
import { Request as req } from 'express'
const App = require('express')
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from '@nestjs/passport';
import { Strategy42 } from './fortytwo.strategy';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,private jwtService: JwtService) {}
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
  @Post('signup')
  signup(@Req() req ,@Body() dto: AuthDto) {
    console.log("*****", req.cookies["authcookie"]);
    console.log("signup",req.cookies['authcookie']['access_token']);
    return this.authService.signup(dto);
  }
  
  // console.log()
  @Get('profile')
  // @UseGuards(AuthGuardJWS)
  async getProfile(@Req() req) {
    // console.log(req)
    // this.authService÷
    console.log(req.cookies['authcookie']);
    try{
      const data = await this.jwtService.verifyAsync(req.cookies['authcookie']['access_token']
      
      
      ,
      {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
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

  @UseGuards(AuthGuard42)
  // @UseGuards(AuthGuard('42')) // Replace '42' with the appropriate strategy name
  @Get('/callback')
  async fortyTwoAuthRedirect(@Request() req, @Res() res: Response) {
    // if user exist
      //42=>req.user{acc& ref} =>req.usrif login else signup 
    console.log("========",req.user)
    const user = await this.authService.userfind(req.user);//user
    res.cookie('authcookie',req.user1, {
      httpOnly: true,
      secure: true,
    });
    if(!user)
    {
      console.log('go to register page');
      return res.redirect('http://localhost:3000/register?=1235646');
    }
    else
    {
      res.cookie('authcookie',user);
      // // console.log(res);
      return res.redirect('http://localhost:3000/')
    }
    console.log(user);
    const cookie = req.cookies
    console.log(cookie)
  }
}
