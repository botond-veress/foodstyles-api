import { NestFactory } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { LoggerErrorInterceptor, Logger } from 'nestjs-pino';

import { config as appConfig } from './config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);

  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);

  await app.listen(config.port);

  logger.log(`App is running on port ${config.port}.`);
}

bootstrap();
