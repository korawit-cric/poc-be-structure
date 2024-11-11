import {
  ForeignKeyConstraintViolationException,
  UniqueConstraintViolationException,
} from "@mikro-orm/core";
import { NextFunction, Request, Response } from "express";
import { camelCase, capitalize } from "lodash";

import { BaseError } from "@/lib/errors";
import { logger } from "@/middlewares/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError && err.statusCode) {
    const detail = err.detail ? { detail: err.detail } : {};

    return res.status(err.statusCode).json({ name: err.name, ...detail });
  }

  if (err instanceof UniqueConstraintViolationException) {
    return handleUniqueContraintError(res, err);
  }

  if (err instanceof ForeignKeyConstraintViolationException) {
    return handleForeignKeyContraintError(res, err);
  }

  next(err);
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`[Error] ${err.stack}`);

  return res.status(500).send({ name: "Internal server error" });
};

const handleUniqueContraintError = (
  res: Response,
  err: UniqueConstraintViolationException
) => {
  const { detail, table } = err as unknown as { detail: string; table: string };

  const keyRegex = /Key \(([^)]+)\)/;

  const [, errorProperty] = detail.match(keyRegex) || [];

  if (errorProperty) {
    return res.status(422).json({
      name: "UniqueConstraint",
      detail: [
        {
          resource: capitalize(table),
          property: camelCase(errorProperty),
          constraints: ["unique"],
        },
      ],
    });
  }
};

const handleForeignKeyContraintError = (
  res: Response,
  err: ForeignKeyConstraintViolationException
) => {
  const { detail } = err as unknown as { detail: string };

  const keyRegex = /Key \(([^)]+)\)/;

  const [, errorProperty] = detail.match(keyRegex) || [];

  if (errorProperty) {
    return res.status(422).json({
      name: "ForeignKeyContraint",
      detail: [
        { property: camelCase(errorProperty), constraints: ["does not exist"] },
      ],
    });
  }
};
