import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    users(id: string): Promise<import(".prisma/client").Profile>;
    updateUser(id: string, uname: string, image: string): Promise<import(".prisma/client").User>;
}
