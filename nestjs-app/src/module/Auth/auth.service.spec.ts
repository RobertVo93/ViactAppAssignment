import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { FirebaseAuthenticationService } from "../firebase-authen";
import { UserService } from "../user";
import { JwtService } from "@nestjs/jwt";
import { IUser, UserEntity } from "@/database";
import { RegisterDto } from "./dto";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fireAuthService: FirebaseAuthenticationService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService]
    })
      .useMocker((token) => {
        switch (token) {
          case FirebaseAuthenticationService:
            return {
              verify: jest.fn(),
              hash: jest.fn(),
            };
          case UserService:
            return {
              getUserByEmail: jest.fn(),
              createUser: jest.fn(),
            };
          case JwtService:
            return {
              sign: jest.fn(),
            };
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    fireAuthService = module.get<FirebaseAuthenticationService>(FirebaseAuthenticationService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });
  beforeAll(() => {
    process.env = {
      JWT_SECRET: "JWT_SECRET",
      JWT_EXPIRATION_TIME: "JWT_EXPIRATION_TIME",
    }
  });

  afterEach(() => {
    // clear all mocking status
    jest.clearAllMocks();
  });

  describe("generateAuthToken", () => {
    it("Should generate accessToken success", async () => {
      // mock data
      const params = "userId";
      const result = "accessToken";

      // mock service
      jest.spyOn(jwtService, "sign")
        .mockReturnValue(result);

      const output = await service.generateAuthToken(params);
      // expecting
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: params },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: `${process.env.JWT_EXPIRATION_TIME}s`,
        });
      expect(output).toStrictEqual(result);
    });
  });

  describe("getAuthenticatedUser", () => {
    it("Should get Authenticated user success", async () => {
      // mock data
      const params = {
        email: "email",
        plainTextPassword: "plainTextPassword"
      };
      const result: IUser = {
        sysId: "sysId"
      };

      // mock service
      jest.spyOn(userService, "getUserByEmail")
        .mockResolvedValue(result);
      jest.spyOn(fireAuthService, "verify")
        .mockResolvedValue(true);

      const output = await service.getAuthenticatedUser(params.email, params.plainTextPassword);
      // expecting
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(params.email);
      expect(output).toStrictEqual(result);
    });

    it("Should get Authenticated user fail", async () => {
      // mock data
      const params = {
        email: "email",
        plainTextPassword: "plainTextPassword"
      };
      const result: IUser = {
        sysId: "sysId"
      };
      const error = new UnauthorizedException("Wrong credentials provided");

      // mock service
      jest.spyOn(userService, "getUserByEmail")
        .mockResolvedValue(result);
      jest.spyOn(fireAuthService, "verify")
        .mockResolvedValue(false);

      // expecting
      await expect(service.getAuthenticatedUser(params.email, params.plainTextPassword)).rejects.toThrow(error);
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(userService.getUserByEmail).toHaveBeenCalledWith(params.email);
    });
  });

  describe("register", () => {
    it("Should register a new user success", async () => {
      // mock data
      const params: RegisterDto = {
        email: "email",
        password: "password"
      };
      const result: IUser = {
        sysId: "sysId"
      };
      const hashedObject = ["password", "passwordSalt"];

      // mock service
      jest.spyOn(fireAuthService, "hash")
        .mockResolvedValue(hashedObject);
      jest.spyOn(userService, "createUser")
        .mockResolvedValue(result as UserEntity);

      const output = await service.register(params);

      // expecting
      expect(fireAuthService.hash).toHaveBeenCalledTimes(1);
      expect(fireAuthService.hash).toHaveBeenCalledWith(params.password);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith({
        ...params,
        password: hashedObject[0],
        passwordSalt: hashedObject[1],
      });
      expect(output).toStrictEqual(result);
    });
  });
});
