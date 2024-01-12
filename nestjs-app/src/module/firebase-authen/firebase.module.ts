import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { FirebaseAuthenticationService } from "./firebase-authen.service";

@Module({
  imports: [ConfigModule],
  providers: [FirebaseAuthenticationService],
  exports: [FirebaseAuthenticationService]
})
export class FirebaseModule {}
