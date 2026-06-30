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

const e38 = alias(etapas, "e38");
const e13 = alias(etapas, "e13");
const e1 = alias(etapas, "e1");

export function listTechnicalInspectionValidationProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e38.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aberturaEtapa: sql<string>`DATE(${e38.datahoraAberturaEtapa})`.as(
        "abertura_etapa"
      ),
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      diasEtapa: diasEtapa.as("dias_etapa"),
      fechamentoVenda: sql<string>`DATE(${e1.datahoraAberturaEtapa})`.as(
        "fechamento_venda"
      ),
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      e38,
      and(eq(coletaDados.idColeta, e38.codColetaEtapa), eq(e38.codCfgEtapa, 38))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(
      e1,
      and(eq(coletaDados.idColeta, e1.codColetaEtapa), eq(e1.codCfgEtapa, 1))
    )
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .leftJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .where(
      and(
        eq(e38.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e38.bloqueadaEtapa, 0),
        isNotNull(e38.datahoraAberturaEtapa)
      )
    )
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
}

export function getTechnicalInspectionValidationStatusThresholds(): Promise<StatusThresholds> {
  return getStatusThresholdsByKind("technical_inspection_validation");
}

export function upsertTechnicalInspectionValidationStatusThresholds(
  values: StatusThresholds
) {
  return upsertStatusThresholdsByKind(
    "technical_inspection_validation",
    values
  );
}
