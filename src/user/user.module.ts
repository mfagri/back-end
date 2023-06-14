import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { Strategy42 } from "src/auth/fortytwo.strategy";
import { TokenService } from "src/auth/token.sever";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { RoomsModule } from "src/rooms/rooms.module";
import { RoomsService } from "src/rooms/rooms.service";


@Module({
    imports:[AuthModule],
    controllers: [UserController],
    providers: [UserService,Strategy42,TokenService, PrismaService, UserService, RoomsService],
})
export class userModule{

}