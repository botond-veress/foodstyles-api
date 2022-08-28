import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ms from 'ms';

import { RefreshToken } from '../entity';

import { config as refreshTokenConfig } from './refresh-token.config';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject(refreshTokenConfig.KEY)
    private config: ConfigType<typeof refreshTokenConfig>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async createForUser(userId: number) {
    return this.refreshTokenRepository.save(this.create(userId));
  }

  async invalidateById(id: string) {
    return this.deleteById(id);
  }

  async renewById(id: string): Promise<RefreshToken | undefined> {
    // Ideally this function should be a transaction
    const token = await this.findById(id);

    if (!token) return;

    await this.deleteById(id);

    return this.createForUser(token.userId);
  }

  private create(userId: number) {
    return {
      id: RefreshToken.createId(),
      userId,
      expireAt: new Date(Date.now() + ms(this.config.validity))
    };
  }

  private findById(id: string) {
    return this.refreshTokenRepository.createQueryBuilder().where({ id }).andWhere('expireAt > NOW()').getOne();
  }

  private deleteById(id: string) {
    return this.refreshTokenRepository.softDelete({ id });
  }
}
