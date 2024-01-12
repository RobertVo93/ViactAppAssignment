import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IUser } from "src/database";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email"
    });
  }

  async validate(email: string, password: string): Promise<IUser> {
    try {
      const user = await this.authService.getAuthenticatedUser(email, password);
      delete user.password;
      delete user.passwordSalt;
      return user;
    }
    catch (error) {
      if (error?.status === 404) {
        throw new HttpException(
          error?.response?.message,
          HttpStatus.NOT_FOUND
        )
      }
      else if (error?.status === 401) {
        throw new HttpException(
          error?.response?.message,
          HttpStatus.UNAUTHORIZED
        )
      }
      throw new HttpException(
        "System Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
