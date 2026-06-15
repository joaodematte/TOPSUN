import { postgresDb, topsunDb } from "@topsun/db";
import {
  ART_ACCESS_REQUIREMENT_STATUS_THRESHOLDS_ID,
  artAccessRequirementStatusThresholds,
} from "@topsun/db/schema/postgres";
import type { ArtAccessRequirementStatusThresholds } from "@topsun/db/schema/postgres";
import {
  clientes,
  coletaDados,
  etapas,
  usuarios,
} from "@topsun/db/schema/topsun";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { DEFAULT_STATUS_THRESHOLDS } from "../shared/status-thresholds.constants";
import type { StatusThresholds } from "../shared/status-thresholds.constants";

const e5 = alias(etapas, "e5");
const e13 = alias(etapas, "e13");

export function listArtAccessRequirementProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e5.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      diasEtapa: diasEtapa.as("dias_etapa"),
      obsEtapa: e5.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      e5,
      and(eq(coletaDados.idColeta, e5.codColetaEtapa), eq(e5.codCfgEtapa, 5))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .leftJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(e5.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e5.bloqueadaEtapa, 0),
        isNotNull(e5.datahoraAberturaEtapa)
      )
    )
    .orderBy(desc(diasEtapa), asc(coletaDados.idColeta));
}

export async function getArtAccessRequirementStatusThresholds(): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: artAccessRequirementStatusThresholds.attention,
      critical: artAccessRequirementStatusThresholds.critical,
      onTime: artAccessRequirementStatusThresholds.onTime,
    })
    .from(artAccessRequirementStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertArtAccessRequirementStatusThresholds(
  values: Pick<
    ArtAccessRequirementStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(artAccessRequirementStatusThresholds)
    .values({ id: ART_ACCESS_REQUIREMENT_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: artAccessRequirementStatusThresholds.id,
    })
    .returning({
      attention: artAccessRequirementStatusThresholds.attention,
      critical: artAccessRequirementStatusThresholds.critical,
      onTime: artAccessRequirementStatusThresholds.onTime,
    });

  return row;
}
