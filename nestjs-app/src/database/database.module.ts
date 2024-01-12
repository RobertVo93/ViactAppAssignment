import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IMySQLEnvironmentVariables } from "./database.interface";
import { config } from 'dotenv';
config();


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<IMySQLEnvironmentVariables>
      ) => {
        return {
          type: "mysql",
          host: configService.get("MYSQL_HOST"),
          port: configService.get("MYSQL_PORT"),
          database: configService.get("MYSQL_DB"),
          username: configService.get("MYSQL_USER"),
          password: configService.get("MYSQL_PASSWORD"),
          migrations: [__dirname + "/migration/schema/*{.ts,.js}"],
          migrationsRun: JSON.parse(configService.get("MIGRATE_DB") || "false"),
          logging: false,
          connectTimeout: 1000 * 60 * 5, // 5 min,
          pool: {
            max: 10,
            min: 5
          },
          entities: [__dirname + "/entity/*.entity{.ts,.js}"],
          synchronize: JSON.parse(
            configService.get("SYNC_ENTITY_DB") || "false"
          ),
          migrationsTransactionMode: "none"
        };
      }
    })
  ]
})
export class DatabaseModule {}
