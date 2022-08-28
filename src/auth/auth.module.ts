import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user';
import { PasswordHashModule } from '../password-hash';
import { RefreshTokenModule } from '../refresh-token';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { config as authConfig } from './auth.config';
import { JwtStrategy } from './strategy';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    PasswordHashModule,
    ConfigModule.forRoot({ load: [authConfig] }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [authConfig] })],
      inject: [authConfig.KEY],
      useFactory: (auth: ConfigType<typeof authConfig>) => ({
        privateKey: auth.privateKey,
        publicKey: auth.publicKey,
        signOptions: {
          algorithm: 'RS256',
          audience: auth.audience,
          expiresIn: auth.validity
        },
        verifyOptions: {
          algorithms: ['RS256'],
          audience: auth.audience
        }
      })
    }),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: []
})
export class AuthModule {}
