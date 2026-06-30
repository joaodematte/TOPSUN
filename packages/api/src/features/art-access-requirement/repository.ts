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
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
}

export function getArtAccessRequirementStatusThresholds(): Promise<StatusThresholds> {
  return getStatusThresholdsByKind("art_access_requirement");
}

export function upsertArtAccessRequirementStatusThresholds(
  values: StatusThresholds
) {
  return upsertStatusThresholdsByKind("art_access_requirement", values);
}
