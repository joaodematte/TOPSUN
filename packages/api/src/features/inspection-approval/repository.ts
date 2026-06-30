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

const e13 = alias(etapas, "e13");
const e22 = alias(etapas, "e22");
const e24 = alias(etapas, "e24");

export function listInspectionApprovalProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e24.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      diasEtapa: diasEtapa.as("dias_etapa"),
      obsAprovVistoria: e24.obsEtapa,
      obsSolicVistoria: e22.obsEtapa,
      projeto: coletaDados.idColeta,
      protocolo: e22.campopadraoEtapa,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .innerJoin(
      e24,
      and(eq(coletaDados.idColeta, e24.codColetaEtapa), eq(e24.codCfgEtapa, 24))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(
      e22,
      and(eq(coletaDados.idColeta, e22.codColetaEtapa), eq(e22.codCfgEtapa, 22))
    )
    .innerJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .innerJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(e24.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e24.bloqueadaEtapa, 0),
        isNotNull(e24.datahoraAberturaEtapa)
      )
    )
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
}

export function getInspectionApprovalStatusThresholds(): Promise<StatusThresholds> {
  return getStatusThresholdsByKind("inspection_approval");
}

export function upsertInspectionApprovalStatusThresholds(
  values: StatusThresholds
) {
  return upsertStatusThresholdsByKind("inspection_approval", values);
}
