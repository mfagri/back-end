import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from 'passport-42';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Strategy42 } from './fortytwo.strategy';
import { TokenService } from './token.sever';
import { AuthGuard42 } from './auth.guard42';

@Module({
  imports: [
   
    PassportModule.register({ 
      defaultStrategy: '42',
      session: true
      
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    // Strategy42
  ],
  providers: [AuthService,Strategy42,TokenService, AuthGuard42],
  controllers: [AuthController]
})
export class AuthModule {}
