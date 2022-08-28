import * as yup from 'yup';

export const validateConfig = <S extends yup.SchemaOf<unknown>>(schema: S) =>
  schema.validateSync(process.env, { abortEarly: true, stripUnknown: true });
