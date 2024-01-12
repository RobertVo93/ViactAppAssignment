import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../database.entity';
import { IUser } from '../interface';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity implements IUser {
  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    name: 'password_salt',
    type: 'varchar',
    nullable: false,
  })
  passwordSalt: string;
}
