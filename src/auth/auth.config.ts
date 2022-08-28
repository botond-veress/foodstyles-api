import { registerAs } from '@nestjs/config';
import * as yup from 'yup';
import ms from 'ms';

import { validateConfig } from '../config';

export const schema = yup
  .object({
    JWT_PRIVATE_KEY: yup.string().required(),
    JWT_PUBLIC_KEY: yup.string().required(),
    JWT_AUDIENCE: yup.string().optional().default('foodstyles'),
    JWT_VALIDITY: yup
      .string()
      .test((value) => {
        try {
          return !!value && !!ms(value);
        } catch {
          return false;
        }
      })
      .optional()
      .default('1d')
  })
  .required();

export const config = registerAs('auth', () => {
  const config = validateConfig(schema);

  return {
    privateKey: config.JWT_PRIVATE_KEY,
    publicKey: config.JWT_PUBLIC_KEY,
    audience: config.JWT_AUDIENCE,
    validity: config.JWT_VALIDITY
  };
});
