import { registerAs } from '@nestjs/config';
import * as yup from 'yup';

import { validateConfig } from '../config';

export const schema = yup
  .object({
    MYSQL_URI: yup.string().required()
  })
  .required();

export const config = registerAs('sentry', () => {
  const config = validateConfig(schema);

  return {
    uri: config.MYSQL_URI
  };
});
