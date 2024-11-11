import { NextFunction, Request, Response } from "express";
import {
  ContextRunner,
  FieldValidationError,
  ValidationChain,
  ValidationError,
  validationResult,
} from "express-validator";

import { InvalidParams } from "@/lib/errors";

export const validateRequest = (
  validations: (ValidationChain | ContextRunner)[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const validation of validations) {
        await validation.run(req);
      }

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      throw new InvalidParams({
        detail: buildErrorDetail(errors.array({ onlyFirstError: true })),
      });
    } catch (error) {
      next(error);
    }
  };
};

const buildErrorDetail = (errors: ValidationError[]) => {
  return (errors as FieldValidationError[]).map(({ path, msg }) => {
    return {
      field: path,
      value: msg as string,
    };
  });
};
