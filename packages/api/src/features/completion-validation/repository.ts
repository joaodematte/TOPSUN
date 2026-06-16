import { postgresDb, topsunDb } from "@topsun/db";
import {
  COMPLETION_VALIDATION_STATUS_THRESHOLDS_ID,
  completionValidationStatusThresholds,
} from "@topsun/db/schema/postgres";
import type { CompletionValidationStatusThresholds } from "@topsun/db/schema/postgres";
import {
  clientes,
  coletaDados,
  dadosEmissaoContrato,
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
const etapaVenda = alias(etapas, "etapa_vistoria1");
const conclusaoInstalacao = alias(etapas, "conclusao_inst");
const instalador = alias(usuarios, "instalador");

export function listCompletionValidationProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${etapaVistoria.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      aberturaEtapa:
        sql<string>`DATE(${etapaVistoria.datahoraAberturaEtapa})`.as(
          "abertura_etapa"
        ),
      aprovacaoCredito:
        sql<string>`DATE(${etapaCredito.datahoraConclusaoEtapa})`.as(
          "data_aprovacao_credito"
        ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      conclusaoInstalacao:
        sql<string>`DATE(${conclusaoInstalacao.data1Etapa})`.as(
          "conclusao_instalacao"
        ),
      dataSolicitado: etapaVistoria.data1Etapa,
      diasEtapa: diasEtapa.as("dias_etapa"),
      fechamentoVenda:
        sql<string>`DATE(${etapaVenda.datahoraAberturaEtapa})`.as(
          "fechamento_venda"
        ),
      instalador: instalador.idUsuario,
      instaladorNome: instalador.nomeUsuario,
      obsEtapa: etapaVistoria.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      etapaVistoria,
      and(
        eq(etapaVistoria.codColetaEtapa, coletaDados.idColeta),
        eq(etapaVistoria.codCfgEtapa, 36)
      )
    )
    .leftJoin(
      etapaCredito,
      and(
        eq(etapaCredito.codColetaEtapa, coletaDados.idColeta),
        eq(etapaCredito.codCfgEtapa, 13)
      )
    )
    .leftJoin(
      etapaVenda,
      and(
        eq(etapaVenda.codColetaEtapa, coletaDados.idColeta),
        eq(etapaVenda.codCfgEtapa, 1)
      )
    )
    .leftJoin(
      conclusaoInstalacao,
      and(
        eq(conclusaoInstalacao.codColetaEtapa, coletaDados.idColeta),
        eq(conclusaoInstalacao.codCfgEtapa, 35)
      )
    )
    .leftJoin(clientes, eq(clientes.idCliente, coletaDados.clienteColeta))
    .leftJoin(usuarios, eq(usuarios.idUsuario, coletaDados.vendedorColeta))
    .leftJoin(
      dadosEmissaoContrato,
      eq(dadosEmissaoContrato.codColetaEmissao, coletaDados.idColeta)
    )
    .leftJoin(
      instalador,
      eq(instalador.idUsuario, dadosEmissaoContrato.instaladorEmissao)
    )
    .where(
      and(
        eq(etapaVistoria.statusEtapa, 0),
        eq(etapaVistoria.bloqueadaEtapa, 0),
        isNotNull(etapaVistoria.datahoraAberturaEtapa),
        eq(coletaDados.statusColeta, 2)
      )
    )
    .orderBy(...orderProjectsByDiasEtapaThenId(diasEtapa));
}

export async function getCompletionValidationStatusThresholds(): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: completionValidationStatusThresholds.attention,
      critical: completionValidationStatusThresholds.critical,
      onTime: completionValidationStatusThresholds.onTime,
    })
    .from(completionValidationStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertCompletionValidationStatusThresholds(
  values: Pick<
    CompletionValidationStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(completionValidationStatusThresholds)
    .values({ id: COMPLETION_VALIDATION_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: completionValidationStatusThresholds.id,
    })
    .returning({
      attention: completionValidationStatusThresholds.attention,
      critical: completionValidationStatusThresholds.critical,
      onTime: completionValidationStatusThresholds.onTime,
    });

  return row;
}
