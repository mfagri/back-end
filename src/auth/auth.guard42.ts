import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard, AuthGuard as PassportAuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";

@Injectable()
export class AuthGuard42 extends AuthGuard("42") {
  async canActivate(context: ExecutionContext) {
    const active = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    console.log("===", request.payload)
    // const token = this.extractTokenFromHeader(request);
    await super.logIn(request);
    // console.log(token);
    return active;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      request.headers.get("authorization")?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
  // serialize(user: User, done: (err: Error, id: any) => void): void {
  //   done(null, user.id);
  // }
  // deserializ(id: any, done: (err: Error, user: User) => void): void {
  //   // Fetch the user from the database using the provided id
  //   // const user = {
  //   //   username:
  //   // }; // Fetch user by id from the database

  //   done(null, id);
  // }
  // //Seriliezer
  //Serilieze && Deserili
  //PassportSerilizer
}
