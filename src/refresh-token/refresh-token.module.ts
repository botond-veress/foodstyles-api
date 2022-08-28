import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from '../entity';

import { config } from './refresh-token.config';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), ConfigModule.forRoot({ load: [config] })],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
