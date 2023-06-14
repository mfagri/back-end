import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { createConversationDto } from "../dto/room/createConversationDto";
import { CreateHistogramOptions } from "perf_hooks";
import { createGroupDto } from "../dto/room/createGroupDto";

@Controller("rooms")
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post("/createConversation")
  createConversation(@Body() roomInfo: createConversationDto) {
    // return this.roomsService.createConversation(roomInfo);
  }

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
}
