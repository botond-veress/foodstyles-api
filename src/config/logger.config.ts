import { registerAs } from '@nestjs/config';
import * as yup from 'yup';

import { validateConfig } from '../config';

export const schema = yup
  .object({
    LOG_LEVEL: yup.string().default('info')
  })
  .required();

export const config = registerAs('logger', () => {
  const config = validateConfig(schema);

  return {
    level: config.LOG_LEVEL
  };
});
