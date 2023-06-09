import { PassportSerializer } from "@nestjs/passport";

export class Serializer extends PassportSerializer {
  serializeUser(user: any, done: Function) {
    console.log("serialize",user);
    done(null, user);
  }
  deserializeUser(payload: any, done: Function) {
    console.log("deserialize",payload);
    done(null,payload);
  }
}
