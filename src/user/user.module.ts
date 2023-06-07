import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Strategy42 } from "src/auth/fortytwo.strategy";


@Module({
    imports:[],
    controllers: [UserController],
    providers: [UserService,Strategy42],
})
export class userModule{

}