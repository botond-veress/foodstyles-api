import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';

import { config as appConfig } from './config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  await app.listen(config.port);
}

bootstrap();
