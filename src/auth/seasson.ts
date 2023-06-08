import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, id: any) => void): void {
    done(null, user.id);
  }

  deserializeUser(id: any, done: (err: Error, user: User) => void): void {
    // Fetch the user from the database using the provided id
    // const user = ...; // Fetch user by id from the database
    
    done(null, null);
  }
}
