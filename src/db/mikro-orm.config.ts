import { Migrator } from "@mikro-orm/migrations";
import { Options, PostgreSqlDriver, defineConfig } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";
import "dotenv/config";
import {
  SOFT_DELETABLE_FILTER,
  SoftDeleteHandler,
} from "mikro-orm-soft-delete";

export default defineConfig({
  entities: ["./dist/src/entities"],
  entitiesTs: ["./src/entities"],
  driver: PostgreSqlDriver,
  clientUrl: process.env.DATABASE_URL,
  migrations: {
    pathTs: "src/db/migrations",
    disableForeignKeys: false,
  },
  metadataProvider: TsMorphMetadataProvider,
  filters: {
    [SOFT_DELETABLE_FILTER]: {
      cond: {},
    },
  },
  debug: false,
  extensions: [Migrator, SoftDeleteHandler],
}) as Options;
