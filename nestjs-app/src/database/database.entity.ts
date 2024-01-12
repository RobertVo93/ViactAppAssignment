import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { IBaseEntity, IPureEntity } from "./database.interface";

export class PureEntity implements IPureEntity {
  @CreateDateColumn({
    name: "created_at",
    type: "timestamp"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp"
  })
  updatedAt: Date;

  @Column({
    name: "created_by",
    type: "varchar",
    nullable: true
  })
  createdBy: string;

  @Column({
    name: "updated_by",
    type: "varchar",
    nullable: true
  })
  updatedBy: string;
}

export class BaseEntity extends PureEntity implements IBaseEntity {
  @PrimaryGeneratedColumn("uuid", { name: "sys_id" })
  sysId: string;
}
