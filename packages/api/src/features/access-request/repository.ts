import { postgresDb, topsunDb } from "@topsun/db";
import {
  ACCESS_REQUEST_STATUS_THRESHOLDS_ID,
  accessRequestStatusThresholds,
} from "@topsun/db/schema/postgres";
import type { AccessRequestStatusThresholds } from "@topsun/db/schema/postgres";
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

const e14 = alias(etapas, "e14");
const e13 = alias(etapas, "e13");
const e19 = alias(etapas, "e19");

export function listAccessRequestProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e14.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      dataFaturamento: sql<string>`DATE(${e19.data1Etapa})`.as(
        "data_faturamento"
      ),
      diasEtapa: diasEtapa.as("dias_etapa"),
      obsEtapa: e14.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .innerJoin(
      e14,
      and(eq(coletaDados.idColeta, e14.codColetaEtapa), eq(e14.codCfgEtapa, 14))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(
      e19,
      and(eq(coletaDados.idColeta, e19.codColetaEtapa), eq(e19.codCfgEtapa, 19))
    )
    .innerJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .innerJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(e14.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e14.bloqueadaEtapa, 0),
        isNotNull(e14.datahoraAberturaEtapa)
      )
    )
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
}

export async function getAccessRequestStatusThresholds(): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: accessRequestStatusThresholds.attention,
      critical: accessRequestStatusThresholds.critical,
      onTime: accessRequestStatusThresholds.onTime,
    })
    .from(accessRequestStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertAccessRequestStatusThresholds(
  values: Pick<
    AccessRequestStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(accessRequestStatusThresholds)
    .values({ id: ACCESS_REQUEST_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: accessRequestStatusThresholds.id,
    })
    .returning({
      attention: accessRequestStatusThresholds.attention,
      critical: accessRequestStatusThresholds.critical,
      onTime: accessRequestStatusThresholds.onTime,
    });

  return row;
}
