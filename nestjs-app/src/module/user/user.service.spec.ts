import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { IUser, UserEntity } from "src/database";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto";
import UserNotFoundException from "./exception/userNotFound.exception";

describe("UserService", () => {
  let service: UserService;
  let userRepo: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository
        }
      ]
    }).compile();

    service = await moduleRef.get<UserService>(UserService);
    userRepo = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );
  });

  afterEach(() => {
    // clear all mocking status
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a new User", async () => {
      // mock data
      const payload: CreateUserDto = {
        email: "email",
        password: "password",
        passwordSalt: "passwordSalt",
      };

      // mock service
      jest
        .spyOn(userRepo, "create")
        .mockReturnValue(payload as UserEntity);
      jest
        .spyOn(userRepo, "save")
        .mockResolvedValue(payload as UserEntity);

      const output = await service.createUser(payload);

      // expecting
      expect(output).toEqual(payload);
    });
  });

  describe("getUserById", () => {
    it("should get User By Id success", async () => {
      // mock data
      const params = "sysId";
      const result: IUser = {
        sysId: "sysId"
      }

      // mock service
      jest
        .spyOn(userRepo, "findOne")
        .mockResolvedValue(result as UserEntity);

      const output = await service.getUserById(params);

      // expecting
      expect(output).toEqual(result);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { sysId: params } });
    });

    it("User not found with sysId", async () => {
      // mock data
      const params = "sysId";

      // mock service
      jest
        .spyOn(userRepo, "findOne")
        .mockResolvedValue(null);

      // expecting
      await expect(service.getUserById(params)).rejects.toThrow(new UserNotFoundException(params));
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { sysId: params } });
    });
  });

  describe("getUserByEmail", () => {
    it("should get User By email success", async () => {
      // mock data
      const params = "email";
      const result: IUser = {
        email: "email"
      }

      // mock service
      jest
        .spyOn(userRepo, "findOne")
        .mockResolvedValue(result as UserEntity);

      const output = await service.getUserByEmail(params);

      // expecting
      expect(output).toEqual(result);
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: params } });
    });

    it("User not found with email", async () => {
      // mock data
      const params = "email";

      // mock service
      jest
        .spyOn(userRepo, "findOne")
        .mockResolvedValue(null);

      // expecting
      await expect(service.getUserByEmail(params)).rejects.toThrow(new UserNotFoundException("", params));
      expect(userRepo.findOne).toHaveBeenCalledTimes(1);
      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { email: params } });
    });
  });
});
