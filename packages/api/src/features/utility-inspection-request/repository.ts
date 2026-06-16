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
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { orderProjectsByDiasEtapaThenId } from "../shared/project-list-order";
import { DEFAULT_STATUS_THRESHOLDS } from "../shared/status-thresholds.constants";
import type { StatusThresholds } from "../shared/status-thresholds.constants";

const etapaVistoria = alias(etapas, "etapa_vistoria");
const etapaCredito = alias(etapas, "etapa_credito");

export function listUtilityInspectionRequestProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${etapaVistoria.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aprovacaoCredito:
        sql<string>`DATE(${etapaCredito.datahoraConclusaoEtapa})`.as(
          "aprovacao_credito"
        ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      dataSolicitado: etapaVistoria.data1Etapa,
      diasEtapa: diasEtapa.as("dias_etapa"),
      obsEtapa: etapaVistoria.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      etapaVistoria,
      and(
        eq(coletaDados.idColeta, etapaVistoria.codColetaEtapa),
        eq(etapaVistoria.codCfgEtapa, 22)
      )
    )
    .leftJoin(
      etapaCredito,
      and(
        eq(coletaDados.idColeta, etapaCredito.codColetaEtapa),
        eq(etapaCredito.codCfgEtapa, 13)
      )
    )
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .leftJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(etapaVistoria.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(etapaVistoria.bloqueadaEtapa, 0),
        isNotNull(etapaVistoria.datahoraAberturaEtapa)
      )
    )
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
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
