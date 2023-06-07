import { PassportSerializer } from '@nestjs/passport';
import { User } from "@prisma/client";
export declare class SessionSerializer extends PassportSerializer {
    serializeUser(user: User, done: (err: Error, id: any) => void): void;
    deserializeUser(id: any, done: (err: Error, user: User) => void): void;
}
