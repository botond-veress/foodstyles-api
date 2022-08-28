import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

import * as entities from './src/entity';

config();

const configService = new ConfigService();

export const app = new DataSource({
  type: 'mysql',
  url: configService.get('MYSQL_URI'),
  entities: Object.values(entities),
  migrations: ['migrations/*.ts']
});
