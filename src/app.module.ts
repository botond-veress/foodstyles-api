import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config as appConfig } from './config/app.config';

@Module({
  imports: [ConfigModule.forRoot({ load: [appConfig] })]
})
export class AppModule {}
