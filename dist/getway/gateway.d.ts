import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
export declare class MyGateway implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    server: Server;
    socket1: Socket;
    onModuleInit(): void;
    handleDisconnect(client: Socket): Promise<void>;
}
