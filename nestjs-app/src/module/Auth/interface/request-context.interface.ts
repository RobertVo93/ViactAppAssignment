import { Request } from "express";
import { UserEntity } from "src/database";

export interface RequestContext extends Request {
  user: UserEntity;
}
