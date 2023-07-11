import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  Req,
  Request,
  Res,
  Session,
  UseGuards,
} from "@nestjs/common";
import { AuthDto } from "../dto/auth";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { AuthGuard42 } from "./auth.guard42";
import { jwtConstants } from "./constants";
import { generatsecret, getqrcode, validepass } from "../2FA/index";
import { AuthGuardJWS } from "./auth.guard";
const App = require("express");

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Get("2FA")
  async googleauth() {
    return await getqrcode(generatsecret("2FA"));
  }
  @Post("2FA")
  verfey(@Body() data: { secret: string; code: string }) {
    console.log(data);
    var s = validepass(data.secret, data.code);
    return s;
  }
  @Post("signup")
  async signup(@Req() req, @Body() dto: AuthDto, @Query() q) {
    return this.authService.signup(dto, req.cookies["authcookie"]);
  }
  @UseGuards(AuthGuardJWS)
  @Get("profile")
  async getProfile(@Req() req, @Session() a) {
    a.authenticated = true;
    try {
      console.log("id is ",req.user.id)
      return this.authService.findone(req.user.id);
    } catch (e) {
      throw new ForbiddenException("no user here");
    }
  }
  @UseGuards(AuthGuard42)
  @Get("42")
  async fortyTwoAuth() {
    console.log("42 login");
  }
  @Get("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("authcookie", { expires: new Date() });
  }

  @UseGuards(AuthGuard42)
  @Get("/callback")
  async fortyTwoAuthRedirect(
    @Session() a,
    @Request() req,
    @Res() res: Response
  ) {
    a.authenticated = true;
    const user = await this.authService.userfind(req.user);

    res.cookie("authcookie", req.user, {});
    if (!user) {
      return res.redirect("http://localhost:3000/register");
    } else {
      res.cookie("authcookie", user);
      return res.redirect("http://localhost:3000/");
    }
  }
}
