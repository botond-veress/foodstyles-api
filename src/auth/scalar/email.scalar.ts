import { ValidatedScalar } from './validated.scalar';

export const EmailScalar = new ValidatedScalar({
  name: 'Email',
  schema: (yup) => yup.string().email().required()
});
