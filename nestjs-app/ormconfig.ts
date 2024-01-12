import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
 
export default new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: ["src/database/entity/*.ts"],
  migrations: [
    process.env.DATA_MIGRATION_DIR || "src/database/migration/schema/*.ts"
  ],
  synchronize: false
});
