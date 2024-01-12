import { IBaseEntity } from "../database.interface";

export interface IUser extends IBaseEntity {
  email?: string;
  password?: string;
  passwordSalt?: string;
}
