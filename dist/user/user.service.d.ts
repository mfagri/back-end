import { PrismaService } from "src/prisma/prisma.service";
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByid(username: string): Promise<import(".prisma/client").User>;
    updateusername(id: string, username: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    updateuserimage(id: string, image: string): Promise<import(".prisma/client").User & {
        profile: import(".prisma/client").Profile;
    }>;
    getprofile(id: number): Promise<import(".prisma/client").Profile>;
}
