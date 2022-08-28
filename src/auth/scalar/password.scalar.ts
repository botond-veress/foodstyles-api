import { ValidatedScalar } from './validated.scalar';

export const PasswordScalar = new ValidatedScalar({
  name: 'Password',
  schema: (yup) => yup.string().min(6).required()
});
