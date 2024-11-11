import { EntityRepository, SelectQueryBuilder } from "@mikro-orm/postgresql";

import { getPaginationOpts } from "@/lib/pagination";
import { ListOpts } from "@/repositories/helpers/type";

export const appendQueryOpts = <EntityType extends object>(
  qb: SelectQueryBuilder<EntityType>,
  opts: ListOpts<EntityType>
) => {
  const { page, limit, pagination, ...findOpts } = opts;

  const { limit: limitOpts, offset } = getPaginationOpts(
    page,
    limit,
    pagination
  );
  qb = qb.limit(limitOpts).offset(offset);

  if (findOpts.orderBy) {
    qb = qb.orderBy(findOpts.orderBy);
  }

  return qb;
};

export const getGroupByResultAndCount = async <
  EntityType extends object,
  RepositoryType extends EntityRepository<EntityType>,
>(
  repository: RepositoryType,
  qb: SelectQueryBuilder<EntityType>
): Promise<[EntityType[], number]> => {
  const results = await qb.clone().getResult();

  const count = await getGroupByCount(repository, qb);

  return [results, count];
};

export const getGroupByCount = async <
  EntityType extends object,
  RepositoryType extends EntityRepository<EntityType>,
>(
  repository: RepositoryType,
  qb: SelectQueryBuilder<EntityType>
): Promise<number> => {
  const { count }: { count: string } = await repository
    .createQueryBuilder()
    .count()
    .from(qb.clone().limit(undefined).offset(undefined))
    .execute("get");

  return Number(count);
};
