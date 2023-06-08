import { Injectable } from "@nestjs/common";

@Injectable()
export class TokenService {
  private tokens: string[] = [];

  saveToken(token: string) {
    this.tokens.push(token);
  }

  getTokens(): string[] {
    return this.tokens;
  }
}