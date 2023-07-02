import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
// import session from 'express-session';
import * as session from 'express-session';
import passport from 'passport';
import * as cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { PassportModule } from '@nestjs/passport';
// import { PrismaClient } from '@prisma/client';
// import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { ExceptionFilter } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  PassportModule.register({ 
    defaultStrategy: '42',
    session: true
    
  }),
  app.use(
    session({
      // name: "session/-mfagri",
      secret: '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',
      resave: false,
      saveUninitialized: false,
      // cookie:{
      //   maxAge:10000
      // },
      // store: new PrismaSessionStore(
      //   new PrismaClient(),
      //   {
      //     checkPeriod: 2 * 60 * 1000,  //ms
      //     dbRecordIdIsSessionId: true,
      //     dbRecordIdFunction: undefined,
      //   }
      // )
    }),
  );
  // app.useGlobalFilters(new GlobalExceptionFilter())
  app.enableCors({
    origin:'http://localhost:3000',
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
    }),
  );
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(5000);
}

bootstrap();
