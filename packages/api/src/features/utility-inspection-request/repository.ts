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

export function getUtilityInspectionRequestStatusThresholds(): Promise<StatusThresholds> {
  return getStatusThresholdsByKind("utility_inspection_request");
}

export function upsertUtilityInspectionRequestStatusThresholds(
  values: StatusThresholds
) {
  return upsertStatusThresholdsByKind("utility_inspection_request", values);
}
