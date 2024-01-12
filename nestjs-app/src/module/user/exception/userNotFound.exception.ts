import { NotFoundException } from "@nestjs/common";

class UserNotFoundException extends NotFoundException {
  constructor(userId: string, email?: string) {
    if (email) {
      super(`User with email ${email} not found`);
      return;
    }
    super(`User with sysId ${userId} not found`);
  }
}

export default UserNotFoundException;
