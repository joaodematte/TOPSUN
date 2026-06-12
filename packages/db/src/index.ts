import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle } from "drizzle-orm/node-postgres";

import * as postgresSchema from "./schema/postgres";
import * as topsunSchema from "./schema/topsun";

export function createPostgresDb() {
  return drizzle(process.env.DATABASE_URL ?? "", { schema: postgresSchema });
}

export function createTopsunDb() {
  return drizzleMysql(process.env.TOPSUN_DATABASE_URL ?? "", {
    mode: "default",
    schema: topsunSchema,
  });
}

export const postgresDb = createPostgresDb();
export const topsunDb = createTopsunDb();
