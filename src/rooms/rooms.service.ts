import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ChangeRoleInfoDto } from "../dto/room/changeRoleInfoDto";
import { createGroupDto } from "../dto/room/createGroupDto";
import { PrismaService } from '../prisma/prisma.service';
import { group } from "console";
import { connect } from "http2";
import * as moment from 'moment';
import { number } from "yargs";

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async muteTheUser(userId: number, mutedId: number, roomId: number, mutedDuration: number) {
    userId = Number(userId);
    roomId = Number(roomId);
    mutedId = Number(mutedId);
    mutedDuration = Number(mutedDuration);
    await this.checkMutingPermission(userId, mutedId, roomId);
    const now_ = moment().add(5, 'minutes');
    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        mutedUser: {
          create: {
            muted: {
              connect: {
                id: mutedId,
              }
            },
            muteduntil: "test",
          }
        }
      }
    })
    return "user muted!";
  }

  async getRoomMessages(roomId: number) {
    const messages = await this.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
      where: {
        roomId,
      },
      select: {
        content: true,
        createdAt: true,
        createdBy: {
          select: {
            username: true,
            id: true,
          },
        },
      },
    });
    if (!messages) {
      throw new NotFoundException("No messages found in this room");
    }
    return messages;
  }

  async createConversation(userId: number, joinWithId: number){    
    userId = Number(userId);
    joinWithId = Number(joinWithId);
    const newRoom = await this.prisma.room.create({
      data: {
        whoJoined: {
          connect: { id: userId },
        },
      },
    });
    this.addRoomToInbox(newRoom.id, userId);
    this.addUserToTheRoom(newRoom.id, joinWithId);
  }
  
  async createGroup(roomInfo: createGroupDto) {
    let { userId, groupName } = roomInfo;
    
    userId = Number(userId);
    this.checkPermisionForCreateGroup(userId);
    const newRoom = await this.prisma.room.create({
      data: {
        group: true,
        room_name: groupName,
        roomPicture: roomInfo.roomPicture,
        whoJoined: {
          connect: { id: userId },
        },
        role: {
          create: {
            owner: {
              connect: {
                id: userId
              },
            }
          }
        }
      },
    });
    this.addRoomToInbox(newRoom.id, userId);
  }

  
  // async changeRoleForTheUser(userId: number, changeId: number, giveRole: number, roomId: number) {
  async changeRoleForTheUser(changeRoleInfo: ChangeRoleInfoDto) {
    let { userId, roleId, changeId, roomId } = changeRoleInfo;
    roleId = Number(roleId);
    userId = Number(userId);
    changeId = Number(changeId);
    roomId = Number(roomId);
    await this.checkPermissionForChangeRole(userId, changeId, roleId, roomId);
    if (roleId === 0) {
      await this.prisma.role.update({
        where: {
          roomId,
        },
        data: {
          member: {
            disconnect: {
              id: changeId,
            }
          },
          adminisrator: {
            connect: {
              id: changeId,
            },
          }
        }
      })
    }
    else if (roleId === 1) {
      await this.prisma.role.update({
        where: {
          roomId,
        },
        data: {
          adminisrator: {
            disconnect: {
              id: changeId,
            }
          },
          member: {
            connect: {
              id: changeId,
            },
          }
        }
      })
    }
    return "Role changed successfully!";
  }

  async joinRoom(roomId: number, userId: number) {
    const room = await this.prisma.room.findUnique({
      where: {
          id: roomId,
      },
      select: {
        whoJoined: true,
        group: true,
      }
    })
    if (!room || !room.group) {
      throw new NotFoundException("No group founded!");
    }
    if (room.whoJoined.some(user => user.id === userId)) {
      throw new BadRequestException("User already joined!");
    }
    this.addUserToTheRoom(roomId, userId);
    this.addRoomToInbox(roomId, userId);
    return "user joined successfully!"
  }

  async addRoomToInbox(roomId: number, userId: number) {
    await this.prisma.inbox.update({
      where: {
        userId: userId,
      },
      data: {
        rooms: {
          connect: {
            id: roomId,
          },
        },
      },
    });
  }
  
  async giveRoleToNewUser(roomId: number, userId: number) {
    const role =  await this.prisma.role.update({
      where: { roomId },
      data: {
        member: {
          connect: {
            id: userId,
          }
        }
      }
    })
  }

  async addUserToTheRoom(roomId: number, userId: number) {
    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: {
        whoJoined: {
          connect: {
            id: userId,
          },
        },
      },
    });
    if (!room)
      throw new NotFoundException("No room founded!");
    if (room.group)
      this.giveRoleToNewUser(roomId, userId);
    this.addRoomToInbox(roomId, userId);
  }

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////

  //rooleId=0 means the user is trying to make the other user a administrator
  //rooleId=1 means the user is trying to make the other user a member
  async checkPermissionForChangeRole(userId: number, changeId: number, roleId: number, roomId: number) {
    const room = await this.prisma.room.findUnique({
      where : {
        id : roomId,
      },
      select :{
        group: true,
        role: {
          select: {
            owner: true,
            member: true,
            adminisrator: true,
          }
        }
      }
    })
    if (!room || !room.group || !room.role)
      throw new BadRequestException('Invalid Group!!');
    if (roleId === 0) {
      if (room.role.owner.id !== userId)
        throw new UnauthorizedException("This user issn't authorized to give administrator role to others!!")
      if (room.role.adminisrator.some(user => user.id === changeId))
        throw new BadRequestException("This user is already an administrator!!")
        if (!room.role.member.some(user => user.id === changeId))  
        throw new BadRequestException("User not member in this group!!")
    }
    else if (roleId === 1) {
      if (room.role.owner.id !== userId)
        throw new UnauthorizedException("This user issn't authorized to change role!!")
      if (room.role.member.some(user => user.id === changeId))  
        throw new BadRequestException("User is already just a member!!")
      if (!room.role.member.some(user => user.id === changeId) && !room.role.adminisrator.some(user => user.id === changeId))
        throw new BadRequestException("User not member in this group!!")
      if (!room.role.adminisrator.some(user => user.id === changeId))
          throw new BadRequestException("This user is not a administrator!!")
    }
  }

  async checkMutingPermission(userId: number, mutedId: number, roomId: number) {
    const room = await this.prisma.room.findUnique({
      where : {
        id: roomId,
      },
      select: {
        role: {
          select: {
            adminisrator: true,
            member: true,
            owner: true
          }
        },
        group: true,
        mutedUser: true,
      }
    });

    if (!room || !room.group || !room.role)
      throw new BadRequestException("no group found!!");
    if (room.role?.owner.id != userId && !room.role.adminisrator.some(user => user.id === userId))
      throw new UnauthorizedException("Unauthorized user!!");
    if (!room.role.member.some(user => user.id === mutedId))
      throw new BadRequestException("user isn't a member!");
    if (room.mutedUser.some(user => user.userId === mutedId))
      throw new BadRequestException("user already muted!");
  }

  async checkPermisionForCreateGroup(userId: number) {
    const user = await this.prisma.user.findUnique({
          where: {
            id: userId,
          },
    });
    if (!user) {
      throw new NotFoundException("user not found");
    }
  }
}
