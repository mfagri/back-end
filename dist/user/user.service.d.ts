import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByid(username: string): Promise<import(".prisma/client").User>;
    updateusername(id: number, username: string): Promise<import(".prisma/client").User>;
    updateuserimage(id: number, image: string): Promise<import(".prisma/client").User>;
    getprofile(id: number): Promise<import(".prisma/client").Profile>;
}
