import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  passwordSalt: string;
}
