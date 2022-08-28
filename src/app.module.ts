import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { SentryModule, SentryService } from '@ntegral/nestjs-sentry';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { config as appConfig, Environment } from './config/app.config';
import { config as sentryConfig } from './config/sentry.config';
import { config as loggerConfig } from './config/logger.config';
import { config as databaseConfig } from './config/database.config';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { TodoModule } from './todo';

import * as entities from './entity';

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
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [databaseConfig] })],
      inject: [databaseConfig.KEY],
      useFactory: (database: ConfigType<typeof databaseConfig>) => ({
        type: 'mysql',
        url: database.uri,
        entities: Object.values(entities),
        synchronize: false
      })
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule.forRoot({ load: [appConfig] })],
      inject: [appConfig.KEY],
      driver: ApolloDriver,
      useFactory: (app: ConfigType<typeof appConfig>) => ({
        autoSchemaFile: true,
        playground: app.environment !== Environment.Production
      })
    }),
    UserModule,
    AuthModule,
    TodoModule
  ]
})
export class AppModule {}
