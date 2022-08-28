import { registerAs } from '@nestjs/config';
import * as yup from 'yup';
import ms from 'ms';

import { validateConfig } from '../config';

export const schema = yup
  .object({
    REFRESH_TOKEN_VALIDITY: yup
      .string()
      .test((value) => {
        try {
          return !!value && !!ms(value);
        } catch {
          return false;
        }
      })
      .optional()
      .default('30d')
  })
  .required();

export const config = registerAs('refreshToken', () => {
  const config = validateConfig(schema);

  return {
    validity: config.REFRESH_TOKEN_VALIDITY
  };
});
