import { coletaDados } from "@topsun/db/schema/topsun";
import { asc, desc } from "drizzle-orm";
import type { SQL } from "drizzle-orm";

export function orderProjectsByDiasEtapaThenId(diasEtapa: SQL) {
  return [desc(diasEtapa), asc(coletaDados.idColeta)] as const;
}
