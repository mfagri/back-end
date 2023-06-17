import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { createConversationDto } from "../dto/room/createConversationDto";
import { CreateHistogramOptions } from "perf_hooks";
import { createGroupDto } from "../dto/room/createGroupDto";
import { ChangeRoleInfoDto } from "../dto/room/changeRoleInfoDto";

@Controller("rooms")
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  // @Post("/createConversation")
  // createConversation(@Body() roomInfo: createConversationDto) {
  //   // return this.roomsService.createConversation(roomInfo);
  // }

  @Post("/createGroup")
  createGroup(@Body() roomInfo: createGroupDto) {
    return this.roomsService.createGroup(roomInfo);
  }

  @Put("/joinRoom/:id")
  joinRoom(
    @Param("id", ParseIntPipe) roomId: number,
    @Body("userId", ParseIntPipe) userId: number
  ) {
    return this.roomsService.joinRoom(roomId, userId);
  }

  @Get("/getRoomMessages/:id")
  getRoomMessages(@Param("id", ParseIntPipe) roomId: number) {
    return this.roomsService.getRoomMessages(roomId);
  }

  @Patch("/changeRoleForTheUser")
  changeRoleForTheUser(@Body() changeRoleInfo: ChangeRoleInfoDto) {
    return this.roomsService.changeRoleForTheUser(changeRoleInfo);      
  }

  @Patch("muteTheUser/:id")
  muteTheUser(@Param('id') id: number, @Body("mutedId") mutedId: number, @Body("roomId") roomId: number, @Body("muteDuration") muteDuration: number) {
    return this.roomsService.muteTheUser(id, mutedId, roomId, muteDuration);
  }
  
  @Patch("banTheUser")
  banTheUser(@Body('userId', ParseIntPipe) userId: number, @Body("banedId", ParseIntPipe) mutedId: number, @Body("roomId", ParseIntPipe) roomId: number) {
    return this.roomsService.banTheUser(userId, mutedId, roomId);
  }
}
