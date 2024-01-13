import { Test, TestingModule } from "@nestjs/testing";
import { IUser } from "@/database";
import { LocalStrategy } from "./local.strategy";
import { AuthService } from "../auth.service";
import { HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";

describe("LocalStrategy", () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy]
    })
      .useMocker((token) => {
        switch (token) {
          case AuthService:
            return {
              getAuthenticatedUser: jest.fn(),
            };
        }
      })
      .compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    // clear all mocking status
    jest.clearAllMocks();
  });

  describe("validate", () => {
    it("Should validate success", async () => {
      // mock data
      const params = {
        email: "email",
        password: "password",
      };
      const result: IUser = {
        sysId: "sysId",
      };

      // mock service
      jest.spyOn(authService, "getAuthenticatedUser")
        .mockResolvedValue(result);

      const output = await strategy.validate(params.email, params.password);

      // expecting
      expect(authService.getAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(params.email, params.password);
      expect(output).toStrictEqual(result);
    });

    it("validate with email not found", async () => {
      // mock data
      const params = {
        email: "email",
        password: "password",
      };
      const error = {
        status: 404,
        response: {
          message: "Email not found"
        }
      }
      const result = new HttpException(
        error.response.message,
        HttpStatus.NOT_FOUND,
      );


      // mock service
      jest.spyOn(authService, "getAuthenticatedUser")
        .mockImplementation(() => {
          throw error;
        });

      // expecting
      await expect(strategy.validate(params.email, params.password)).rejects.toThrow(result);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(params.email, params.password);
    });

    it("validate with wrong password", async () => {
      // mock data
      const params = {
        email: "email",
        password: "password",
      };
      const error = new UnauthorizedException("Wrong credentials provided")
      const result = new HttpException(
        error.message,
        HttpStatus.UNAUTHORIZED,
      );


      // mock service
      jest.spyOn(authService, "getAuthenticatedUser")
        .mockImplementation(() => {
          throw error;
        });

      // expecting
      await expect(strategy.validate(params.email, params.password)).rejects.toThrow(result);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(params.email, params.password);
    });

    it("validate error with other issues", async () => {
      // mock data
      const params = {
        email: "email",
        password: "password",
      };
      const result = new HttpException(
        "System Error",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );


      // mock service
      jest.spyOn(authService, "getAuthenticatedUser")
        .mockImplementation(() => {
          throw {};
        });

      // expecting
      await expect(strategy.validate(params.email, params.password)).rejects.toThrow(result);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledTimes(1);
      expect(authService.getAuthenticatedUser).toHaveBeenCalledWith(params.email, params.password);
    });
  });
});
