import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IUser, UserEntity } from "src/database";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto";
import { v4 as uuidv4 } from "uuid";
import UserNotFoundException from "./exception/userNotFound.exception";
export const uuidGen = () => uuidv4();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  /**
   * Create a new user
   * @param createdUser
   * @returns the created user
   */
  async createUser(createdUser: CreateUserDto) {
    // create new user's entity
    const newUser = this.usersRepository.create(createdUser);
    const sysId = uuidGen();
    // save it to db
    const storedUser = await this.usersRepository.save({
      ...newUser,
      sysId,
    });
    delete storedUser.password;
    delete storedUser.passwordSalt;
    return storedUser;
  }

  /**
 * Get user by user's sysId
 * @param sysId
 * @returns
 */
  async getUserById(sysId: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({ where: { sysId } });
    if (user) {
      return user;
    }
    throw new UserNotFoundException(sysId);
  }

  /**
   * Get user by email
   * @param email user's email
   * @returns retrieved user
   */
  async getUserByEmail(email: string): Promise<IUser> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new UserNotFoundException("", email);
  }
}
