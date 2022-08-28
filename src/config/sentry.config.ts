import { registerAs } from '@nestjs/config';
import * as yup from 'yup';

import { validateConfig } from '../config';

export const schema = yup
  .object({
    SENTRY_DSN: yup.string().optional()
  })
  .required();

export const config = registerAs('sentry', () => {
  const config = validateConfig(schema);

  return {
    dsn: config.SENTRY_DSN
  };
});
