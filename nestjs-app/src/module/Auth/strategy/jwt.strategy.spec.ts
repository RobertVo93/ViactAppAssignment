import { Test, TestingModule } from "@nestjs/testing";
import { IUser } from "@/database";
import { JwtStrategy } from "./jwt.strategy";
import { TokenPayload } from "../interface";
import { UserService } from "src/module/user";

describe("JwtStrategy", () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy]
    })
      .useMocker((token) => {
        switch (token) {
          case UserService:
            return {
              getUserById: jest.fn(),
            };
        }
      })
      .compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  beforeAll(() => {
    process.env = {
      JWT_SECRET: "JWT_SECRET"
    }
  });

  afterEach(() => {
    // clear all mocking status
    jest.clearAllMocks();
  });

  describe("validate", () => {
    it("Should validate success", async () => {
      // mock data
      const params: TokenPayload = {
        userId: "userId",
      };
      const result: IUser = {
        sysId: "sysId",
      };

      // mock service
      jest.spyOn(userService, "getUserById")
        .mockResolvedValue(result);

      const output = await strategy.validate(params);

      // expecting
      expect(userService.getUserById).toHaveBeenCalledTimes(1);
      expect(userService.getUserById).toHaveBeenCalledWith(params.userId);
      expect(output).toStrictEqual(result);
    });
  });
});
