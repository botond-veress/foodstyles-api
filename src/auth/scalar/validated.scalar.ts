import * as yup from 'yup';
import { GraphQLScalarType } from 'graphql';
import { UserInputError } from 'apollo-server-express';

export interface ValidatedScalarOptions<S extends yup.SchemaOf<any>> {
  name: string;
  description?: string;
  schema: (y: typeof yup) => S;
}

export class ValidatedScalar<S extends yup.SchemaOf<any>> extends GraphQLScalarType<yup.InferType<S>> {
  protected schema: S;

  constructor(options: ValidatedScalarOptions<S>) {
    super({
      name: options.name,
      description: options.description,
      serialize: (value) => this.validate(value),
      parseValue: (value) => this.validate(value),
      parseLiteral: (ast) => this.validate((ast as any).value),
      extensions: { validation: true }
    });

    this.schema = options.schema(yup);
  }

  private validate(value: yup.InferType<S>) {
    try {
      return this.schema.validateSync(value, {
        abortEarly: true,
        stripUnknown: true
      });
    } catch (error) {
      if (!(error instanceof yup.ValidationError)) throw error;

      throw new UserInputError(error.errors[0], {
        message: error.errors[0]
      });
    }
  }
}
