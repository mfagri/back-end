import { OnModuleInit } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
export declare class MyGateway implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    server: Server;
    onModuleInit(): void;
    handleEvent(client: Socket, data: string): string;
    sendmsg(): void;
    handleDisconnect(client: Socket): void;
}
