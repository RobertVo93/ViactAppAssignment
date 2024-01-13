import { Test, TestingModule } from "@nestjs/testing";
import { FirebaseAuthenticationService } from "./firebase-authen.service";
import { ConfigService } from "@nestjs/config";
import { FirebaseScrypt } from "firebase-scrypt";


describe("AuthService", () => {
  let service: FirebaseAuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseAuthenticationService]
    })
      .useMocker((token) => {
        switch (token) {
          case ConfigService:
            return {
              get: (key: string) => {
                switch (key) {
                  case "FIREBASE_SIGNER_KEY":
                    return "FIREBASE_SIGNER_KEY";
                  case "FIREBASE_SALT_SEPARATOR":
                    return "Bw==";
                  case "FIREBASE_ROUNDS":
                    return 8;
                  case "FIREBASE_MEMCOST":
                    return 14;
                }
              },
            };
          case FirebaseScrypt:
            return {
              hash: jest.fn(),
            };
        }
      })
      .compile();

    service = module.get<FirebaseAuthenticationService>(FirebaseAuthenticationService);
  });

  afterEach(() => {
    // clear all mocking status
    jest.clearAllMocks();
  });

  describe("hash", () => {
    it("Should hash success", async () => {
      // mock data
      const params = "plainText";
      const result = ["hashedText", "11111111111111=="];

      // mock service
      jest.spyOn(service.scrypt, "hash")
        .mockResolvedValue("hashedText");
      jest.spyOn(Math, "floor").mockReturnValue(1);

      const output = await service.hash(params);
      // expecting
      expect(service.scrypt.hash).toHaveBeenCalledTimes(1);
      expect(service.scrypt.hash).toHaveBeenCalledWith(params, result[1]);
      expect(output).toStrictEqual(result);
    });
  });

  describe("verify", () => {
    it("Should verify success", async () => {
      // mock data
      const params = {
        plainText: "plainText",
        salt: "salt",
        hashedText: "hashedText",
      };
      const result = true;

      // mock service
      jest.spyOn(service.scrypt, "verify")
        .mockResolvedValue(result);

      const output = await service.verify(params.plainText, params.salt, params.hashedText);
      // expecting
      expect(service.scrypt.verify).toHaveBeenCalledTimes(1);
      expect(service.scrypt.verify).toHaveBeenCalledWith(params.plainText, params.salt, params.hashedText);
      expect(output).toStrictEqual(result);
    });
  });
});
