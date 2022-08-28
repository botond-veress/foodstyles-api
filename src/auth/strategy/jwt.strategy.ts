import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { config as authConfig } from '../auth.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(authConfig.KEY) config: ConfigType<typeof authConfig>) {
    super({
      algorithms: ['RS256'],
      audience: config.audience,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.publicKey
    });
  }

  async validate({ sub }: { sub: number }) {
    return sub;
  }
}
