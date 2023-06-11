import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Strategy42 } from "src/auth/fortytwo.strategy";
import { TokenService } from "src/auth/token.sever";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports:[AuthModule],
    controllers: [UserController],
    providers: [UserService,Strategy42,TokenService],
})
export class userModule{

}