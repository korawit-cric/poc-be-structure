import { RequestContext } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import type { EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { NextFunction } from "express";
import { Express } from "express";

import mikroORMConfig from "@/db/mikro-orm.config";

export let orm: MikroORM;
export let em: EntityManager;

export const initializeDB = async (app: Express) => {
  const initOrm = await MikroORM.init<PostgreSqlDriver>(mikroORMConfig);
  orm = initOrm;
  em = orm.em as EntityManager;

  app.use((req, res, next) => RequestContext.create(orm.em, next));
};

export const reinitializeRequestContext = (_req, _res, next: NextFunction) => {
  return RequestContext.create(orm.em, next);
};
