import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
export declare class MyGateway implements OnModuleInit {
    private readonly prisma;
    private readonly serv;
    constructor(prisma: PrismaService, serv: UserService);
    server: Server;
    socket1: Socket;
    onModuleInit(): void;
    handleDisconnect(client: Socket): Promise<void>;
}
