import { FindOneOptions, FindOptions } from "@mikro-orm/core";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FilterOpts = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ListOpts<EntityType> extends FindOptions<EntityType, any> {
  includeIds?: number[];
  page?: number;
  pagination?: boolean;
}

export interface GetOpts<EntityType extends object>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extends FindOneOptions<EntityType, any> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordParams = Record<string, any>;
