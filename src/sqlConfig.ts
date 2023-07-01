import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DatabaseConfig {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): any {
    const config = {
      host: this.configService.get('DB_HOST'),
      user: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_SCHEMA'),
    };
    return config;
  }
}