export interface IMySQLEnvironmentVariables {
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DB: string;
  MIGRATE_DB: boolean;
  SYNC_ENTITY_DB: boolean;
}

export interface IPureEntity {
  createdAt?: Date;
  updatedAt?: Date;

  createdBy?: string;
  updatedBy?: string;
}

export interface IBaseEntity extends IPureEntity {
  sysId?: string;
}
