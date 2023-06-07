import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from 'passport-42';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Strategy42 } from './fortytwo.strategy';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: '42',
      
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    // Strategy42
  ],
  providers: [AuthService,Strategy42],
  controllers: [AuthController]
})
export class AuthModule {}
