import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/database';
import { FirebaseAuthenticationService } from '../firebase-authen';
import { RegisterDto } from './dto';
import { UserService } from '../user';
import { TokenPayload } from './interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly fireAuthService: FirebaseAuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Build the cookie for access jwt token
   * @param userId logged in user
   * @returns cookie
   */
  public generateAuthToken(userId: string): string {
    // generate new token with secret key and expiration time (in seconds)
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `${process.env.JWT_EXPIRATION_TIME}s`,
    });
  }

  /**
   * Check if email and password map with account in the db
   * @param email
   * @param plainTextPassword
   * @returns the user's info
   */
  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string
  ): Promise<IUser> {
    // get user's info by the provided email
    const user = await this.userService.getUserByEmail(email);
    // verify the hashed password and the provided one
    await this.verifyPassword(
      plainTextPassword,
      user.password,
      user.passwordSalt
    );
    return user;
  }

  /**
   * Handle register new user
   * @param registerData register data
   * @returns created user
   */
  async register(registerData: RegisterDto) {
    // hash password
    const hashedObject = await this.fireAuthService.hash(registerData.password);
    const newUser = await this.userService.createUser(
      {
        ...registerData,
        password: hashedObject[0],
        passwordSalt: hashedObject[1],
      },
    );
    return newUser;
  }

  /**
   * Compare plain text password and hashed password
   * @param plainTextPassword
   * @param hashedPassword
   * @param salt
   */
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
    salt: string
  ) {
    const isPasswordMatching = await this.fireAuthService.verify(
      plainTextPassword,
      salt,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException("Wrong credentials provided");
    }
  }
}
