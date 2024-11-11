import { Collection } from "@mikro-orm/core";
import { ValidationError, ValidatorOptions, validate } from "class-validator";

import { ArrayValidationError, EntityValidationError } from "@/lib/errors";

export type ValidationArrayError = {
  index: number;
  errors: ValidationError[];
}[];

export const validateEntity = async <T extends object>(
  entity: T,
  opts: ValidatorOptions = {}
) => {
  const validationErrors = await validate(entity, opts);

  if (validationErrors.length > 0) {
    throw new EntityValidationError(validationErrors);
  }

  return true;
};

export const validateArray = async <T extends object>(
  entities: T[] | Collection<T>
) => {
  const validationArrayError: ValidationArrayError = [];

  let index = 0;
  for (const entity of entities) {
    const errors = await validate(entity);

    if (errors.length > 0) {
      validationArrayError.push({ index, errors });
    }

    index = ++index;
  }

  if (validationArrayError.length > 0) {
    throw new ArrayValidationError(validationArrayError);
  }

  return true;
};
