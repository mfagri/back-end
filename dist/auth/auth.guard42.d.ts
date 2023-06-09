import { ExecutionContext } from "@nestjs/common";
declare const AuthGuard42_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AuthGuard42 extends AuthGuard42_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export {};
