import { registerAs } from '@nestjs/config';
import * as yup from 'yup';

import { validateConfig } from './config';

export enum Environment {
  Development = 'dev',
  Staging = 'stg',
  Production = 'prod'
}

export const schema = yup
  .object({
    ENVIRONMENT: yup.mixed<Environment>().oneOf(Object.values(Environment)).default(Environment.Development),
    PORT: yup.number().positive().optional().default(4000)
  })
  .required();

export const config = registerAs('app', () => {
  const config = validateConfig(schema);

  return {
    environment: config.ENVIRONMENT,
    port: config.PORT
  };
});
