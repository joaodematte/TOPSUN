import { postgresDb, topsunDb } from "@topsun/db";
import {
  UTILITY_INSPECTION_REQUEST_STATUS_THRESHOLDS_ID,
  utilityInspectionRequestStatusThresholds,
} from "@topsun/db/schema/postgres";
import type { UtilityInspectionRequestStatusThresholds } from "@topsun/db/schema/postgres";
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

const e22 = alias(etapas, "e22");
const e13 = alias(etapas, "e13");

export function listUtilityInspectionRequestProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e22.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      diasEtapa: diasEtapa.as("dias_etapa"),
      obsEtapa: e22.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      e22,
      and(eq(coletaDados.idColeta, e22.codColetaEtapa), eq(e22.codCfgEtapa, 22))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .leftJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(e22.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e22.bloqueadaEtapa, 0),
        isNotNull(e22.datahoraAberturaEtapa)
      )
    )
    .orderBy(desc(diasEtapa), asc(coletaDados.idColeta));
}

export async function getUtilityInspectionRequestStatusThresholds(): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: utilityInspectionRequestStatusThresholds.attention,
      critical: utilityInspectionRequestStatusThresholds.critical,
      onTime: utilityInspectionRequestStatusThresholds.onTime,
    })
    .from(utilityInspectionRequestStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertUtilityInspectionRequestStatusThresholds(
  values: Pick<
    UtilityInspectionRequestStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(utilityInspectionRequestStatusThresholds)
    .values({ id: UTILITY_INSPECTION_REQUEST_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: utilityInspectionRequestStatusThresholds.id,
    })
    .returning({
      attention: utilityInspectionRequestStatusThresholds.attention,
      critical: utilityInspectionRequestStatusThresholds.critical,
      onTime: utilityInspectionRequestStatusThresholds.onTime,
    });

  return row;
}
