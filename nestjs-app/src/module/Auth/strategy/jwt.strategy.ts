import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { TokenPayload } from "../interface";
import { UserService } from "src/module/user";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.getUserById(payload.userId);
    delete user.password;
    delete user.passwordSalt;
    return user;
  }
}
