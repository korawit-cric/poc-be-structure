import { ValidationError } from "class-validator";
import { flatten } from "lodash";

import { ValidationArrayError } from "@/repositories/helpers/validator";

export class BaseError extends Error {
  name: string = "BaseError";
  statusCode?: number = 500;
  detail?: string | Record<string, number | string | string[]>[];

  constructor({
    message,
    statusCode,
    detail,
  }: {
    message?: string;
    statusCode?: number;
    detail?: string | Record<string, string>[];
  } = {}) {
    super(message);

    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export class BadRequest extends BaseError {
  name: string = "BadRequest";
  statusCode: number = 400;
}

export class InvalidParams extends BaseError {
  name: string = "InvalidParams";
  statusCode: number = 400;
}

export class EntityValidationError extends BaseError {
  name: string = "EntityValidationError";
  statusCode: number = 400;

  constructor(
    errors: ValidationError[],
    { message }: { message?: string } = {}
  ) {
    super({
      message,
    });

    this.detail = formatValidationError(errors);
  }
}

export class ArrayValidationError extends BaseError {
  name: string = "EntityValidationError";
  statusCode: number = 400;

  constructor(
    errors: ValidationArrayError,
    { message }: { message?: string } = {}
  ) {
    super({
      message,
    });

    this.detail = formatArrayValidationError(errors);
  }
}

export class UnauthorizedError extends BaseError {
  name: string = "Unauthorized";
  statusCode: number = 401;
}

export class ForbiddenError extends BaseError {
  name: string = "Forbidden";
  statusCode: number = 403;
}

export class RecordNotFoundError extends BaseError {
  name: string = "RecordNotFoundError";
  statusCode: number = 404;
}

export class UnprocessableEntity extends BaseError {
  name: string = "UnprocessableEntityError";
  statusCode: number = 422;
}

export class InternalServerError extends BaseError {
  name: string = "InternalServerError";
  statusCode: number = 500;
}

const formatValidationError = (errors: ValidationError[]) => {
  const formattedError = errors.map(({ target, property, constraints }) => {
    return {
      resource: target?.constructor.name || "",
      property,
      constraints: Object.keys(constraints || {}),
    };
  });

  return formattedError;
};

const formatArrayValidationError = (arrayErrors: ValidationArrayError) => {
  const formattedError = arrayErrors.map(({ index, errors }) => {
    const arrayError = errors.map(({ target, property, constraints }) => {
      return {
        resource: target?.constructor.name || "",
        property,
        index,
        constraints: Object.keys(constraints || {}),
      };
    });

    return arrayError;
  });

  return flatten(formattedError);
};

export const extractErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "";
};
