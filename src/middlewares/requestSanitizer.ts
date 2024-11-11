import { NextFunction, Request, Response } from "express";

import { parseJSONList } from "@/controllers/helpers/requestHelper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BodyType = { [key: string]: any };

/**
 * Sanitizes the request body of a JSON request. This means removing any
 * malicious or unnecessary data from the request body.
 *
 * Trims the value of string fields in the request body.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @throws If the request body is not a JSON object.
 */
export const sanitizeRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as BodyType;

    if (["POST", "PUT"].includes(req.method)) {
      trimBody(body);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Sanitizes the request body of a multipart request.
 *
 * Trims the value of string fields in the request body, and
 * parses any JSON strings to objects.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next middleware function.
 *
 * @throws If the request body is not a JSON object.
 */
export const sanitizeMultipartBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body as BodyType;

    parseJSONBody(body);
    trimBody(body);

    next();
  } catch (error) {
    next(error);
  }
};

/* eslint-disable
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-call,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-return
*/
const trimBody = (body: BodyType) => {
  for (const key in body) {
    if (typeof body[key] === "object" && !Array.isArray(body[key])) {
      trimBody(body[key]);
    } else if (Array.isArray(body[key])) {
      body[key] = body[key].map((item) => {
        if (typeof item === "string") {
          return item.trim();
        } else if (typeof item === "object") {
          trimBody(item);

          return item;
        }

        return item;
      });
    } else if (typeof body[key] === "string") {
      body[key] = body[key].trim();
    }
  }
};

const parseJSONBody = (body: BodyType) => {
  for (const key in body) {
    try {
      if (Array.isArray(body[key])) {
        body[key] = parseJSONList(body[key]);
      } else if (typeof body[key] === "string") {
        body[key] = JSON.parse(body[key]);
      }
    } catch {
      continue;
    }
  }
};
