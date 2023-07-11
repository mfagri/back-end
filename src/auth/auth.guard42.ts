import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";

@Injectable()
export class AuthGuard42 extends AuthGuard("42") {
  async canActivate(context: ExecutionContext) {
    const active = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return active;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get("authorization")?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
