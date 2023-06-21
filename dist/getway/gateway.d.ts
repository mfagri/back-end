import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { JwtService } from "@nestjs/jwt";
export declare class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly prisma;
    private readonly serv;
    private readonly jwtService;
    constructor(prisma: PrismaService, serv: UserService, jwtService: JwtService);
    server: Server;
    handleConnection(socket: any): void;
    handleDisconnect(client: Socket): Promise<void>;
}
