import { Global, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { Strategy42 } from "./auth/fortytwo.strategy";
import { ConfigModule } from "@nestjs/config";
import { Serializer } from "./auth/serilizer";
import { userModule } from "./user/user.module";
import { TokenService } from "./auth/token.sever";
import { MessagesModule } from "./messages/messages.module";
import { RoomsModule } from "./rooms/rooms.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PassportModule.register({ defaultStrategy: "42" }),
    PassportModule,
    userModule,
    MessagesModule,
    RoomsModule
  ],
  controllers: [AppController],
  providers: [AppService, Strategy42, Serializer,TokenService],
})
export class AppModule {}
