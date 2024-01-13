import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseScrypt } from "firebase-scrypt";

@Injectable()
export class FirebaseAuthenticationService {
  scrypt: FirebaseScrypt;
  constructor(private readonly configService: ConfigService) {
    // Define the hash option of firebase-scrypt
    const hashConfig = {
      signerKey: configService.get("FIREBASE_SIGNER_KEY"),
      saltSeparator: configService.get("FIREBASE_SALT_SEPARATOR"),
      rounds: parseInt(configService.get("FIREBASE_ROUNDS")),
      memCost: parseInt(configService.get("FIREBASE_MEMCOST"))
    };
    // init hash function
    this.scrypt = new FirebaseScrypt(hashConfig);
  }

  /**
   * Has the plain text
   * @param plainText plain text
   * @returns [salt, hashed text]
   */
  public async hash(plainText: string) {
    const salt = this.generateSalt();
    const hashedText = await this.scrypt.hash(plainText, salt);
    return [hashedText, salt];
  }

  /**
   * Compare between plain text and hashed text
   * @param plainText plain text
   * @param salt salt
   * @param hashedText hashed text
   * @returns true/false
   */
  public async verify(
    plainText: string,
    salt: string,
    hashedText: string
  ): Promise<boolean> {
    return this.scrypt.verify(plainText, salt, hashedText);
  }

  /**
   * Generate 16 random characters with 2 == at the end (copy the standard of firebase-salt)
   * @returns
   */
  private generateSalt() {
    const length = 14;
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result + "==";
  }
}
