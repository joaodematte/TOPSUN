import { topsunDb } from "@topsun/db";
import {
  clientes,
  coletaDados,
  etapas,
  usuarios,
} from "@topsun/db/schema/topsun";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { orderProjectsByDiasEtapaThenId } from "../shared/project-list-order";
import type { StatusThresholds } from "../shared/status-thresholds.constants";
import {
  getStatusThresholdsByKind,
  upsertStatusThresholdsByKind,
} from "../shared/summary-thresholds.repository";

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

export function getAccessRequestStatusThresholds(): Promise<StatusThresholds> {
  return getStatusThresholdsByKind("access_request");
}

export function upsertAccessRequestStatusThresholds(values: StatusThresholds) {
  return upsertStatusThresholdsByKind("access_request", values);
}
