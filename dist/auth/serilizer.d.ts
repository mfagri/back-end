import { PassportSerializer } from "@nestjs/passport";
export declare class Serializer extends PassportSerializer {
    serializeUser(user: any, done: Function): void;
    deserializeUser(payload: any, done: Function): void;
}
