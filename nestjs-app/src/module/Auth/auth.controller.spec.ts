import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IUser, UserEntity } from '@/database';
import { RegisterDto } from './dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RequestContext } from './interface';

describe('AuthController', () => {
  let module: TestingModule;
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [AuthController]
    })
      .useMocker((token) => {
        switch (token) {
          case AuthService:
            return {
              register: jest.fn(),
              generateAuthToken: jest.fn(),
            };
        }
      })
      .compile();

    authController = await module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // mock data
      const result: IUser = {
        sysId: "sys_id",
        email: "email",
      }
      const input: RegisterDto = {
        email: "email",
        password: "password",
      };

      // mock services
      jest
        .spyOn(authService, "register")
        .mockResolvedValue(Promise.resolve(result as UserEntity));

      const output = await authController.register(input)

      // Expecting
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(input)
      expect(output).toStrictEqual(result);
    });

    it('Could not register a new user because of duplicating the email', async () => {
      // mock data
      const input: RegisterDto = {
        email: "email",
        password: "password",
      };
      const error = new HttpException(
        "Duplicate email address. Please try another email",
        HttpStatus.CONFLICT,
      );

      // mock services
      jest.spyOn(authService, "register").mockImplementation(() => {
        throw { code: "ER_DUP_ENTRY" };
      });

      // Expecting
      await expect(authController.register(input)).rejects.toThrow(error);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(input);
    });

    it('Could not register a new user because of other issues', async () => {
      // mock data
      const input: RegisterDto = {
        email: "email",
        password: "password",
      };
      const error = new HttpException(
        "Cannot register. Please contact the admin team",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      // mock services
      jest.spyOn(authService, "register").mockImplementation(() => {
        throw { code: "OTHER CODE" };
      });

      // Expecting
      await expect(authController.register(input)).rejects.toThrow(error);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith(input);
    });
  });

  describe('logIn', () => {
    it('should logIn success', async () => {
      // mock data
      const input = {
        user: {
          sysId: "sysId",
        } as UserEntity
      } as RequestContext;
      const accessToken = "accessToken";
      const result = {
        accessToken: accessToken,
        user: input.user,
      }

      // mock services
      jest
        .spyOn(authService, "generateAuthToken")
        .mockReturnValue(accessToken);

      const output = await authController.logIn(input)

      // Expecting
      expect(authService.generateAuthToken).toHaveBeenCalledTimes(1);
      expect(authService.generateAuthToken).toHaveBeenCalledWith(input.user.sysId)
      expect(output).toStrictEqual(result);
    });
  });

  describe('authenticate', () => {
    it('should return authenticate success', async () => {
      // mock data
      const input = {
        user: {
          sysId: "sysId",
        } as UserEntity
      } as RequestContext;

      const output = await authController.authenticate(input)

      // Expecting
      expect(output).toStrictEqual(input.user);
    });
  });
});
