import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { SentryModule, SentryService } from '@ntegral/nestjs-sentry';
import { LoggerModule } from 'nestjs-pino';

import { config as appConfig } from './config/app.config';
import { config as sentryConfig } from './config/sentry.config';
import { config as loggerConfig } from './config/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig] }),
    SentryModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [appConfig, sentryConfig] })],
      inject: [appConfig.KEY, sentryConfig.KEY],
      useFactory: (app: ConfigType<typeof appConfig>, sentry: ConfigType<typeof sentryConfig>) => ({
        dsn: sentry.dsn,
        environment: app.environment
      })
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [appConfig, loggerConfig] }), SentryModule],
      inject: [appConfig.KEY, loggerConfig.KEY, SentryService],
      useFactory: (
        app: ConfigType<typeof appConfig>,
        logger: ConfigType<typeof loggerConfig>,
        sentryService: SentryService
      ) => ({
        exclude: [
          { method: RequestMethod.ALL, path: 'health/readiness' },
          { method: RequestMethod.ALL, path: 'health/liveness' }
        ],
        pinoHttp: {
          base: {},
          formatters: {
            level: (label) => ({ level: label })
          },
          level: logger.level,
          messageKey: 'message',
          mixin: () => ({
            environment: app.environment,
            traceId: sentryService.instance().getCurrentHub().getScope()?.getTransaction()?.traceId
          }),
          redact: {
            paths: ['req.headers.authorization']
          }
        }
      })
    })
  ]
})
export class AppModule {}
