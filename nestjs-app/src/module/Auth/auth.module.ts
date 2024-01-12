import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy, LocalStrategy } from "./strategy";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user";
import { FirebaseModule } from "../firebase-authen";

@Module({
  imports: [
    UserModule,
    PassportModule,
    FirebaseModule,
    JwtModule.registerAsync({
      inject: [],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: `${process.env.JWT_EXPIRATION_TIME}s`
        }
      })
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule { }
