import { em } from '@/db';
import { RecordNotFoundError } from '@/lib/errors';
import { NextFunction, Request, Response } from 'express'
import { User } from '@/entities/User'
import { matchedData } from 'express-validator';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserFromDB(req);

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await em.getRepository(User).getAllUsers();

    // ? What em.populate() does?

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ? What matchedData() does?
    const { user: UserParams } = matchedData(req) as {
      user: Record<string, string>;
    };

    const user = await em
      .getRepository(User)
      .createUser(UserParams);

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // ? What matchedData() does?
    const user = await getUserFromDB(req);
    const { user: UserParams } = matchedData(req) as {
      user: Record<string, string>;
    };

    await em
      .getRepository(User)
      .updateUser(user, UserParams);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserFromDB(req);

    await em.getRepository(User).deleteUser(user);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

const getUserFromDB = async (req: Request) => {
  const user = await em.getRepository(User).get(Number(req.params.id));

  if (!user) {
    throw new RecordNotFoundError({ detail: "User not found" });
  }

  return user;
};
