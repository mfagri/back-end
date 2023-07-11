import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuardJWS implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            {
              secret: jwtConstants.secret,
              ignoreExpiration: true,
            }
            );
        request['user'] = payload;
      } catch {
          throw new UnauthorizedException(); 
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string {
      return request.cookies["authcookie"]["access_token"];
    }
  }