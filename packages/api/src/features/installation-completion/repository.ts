import { postgresDb, topsunDb } from "@topsun/db";
import {
  INSTALLATION_COMPLETION_STATUS_THRESHOLDS_ID,
  installationCompletionStatusThresholds,
} from "@topsun/db/schema/postgres";
import type { InstallationCompletionStatusThresholds } from "@topsun/db/schema/postgres";
import {
  clientes,
  coletaDados,
  dadosEmissaoContrato,
  etapas,
  usuarios,
} from "@topsun/db/schema/topsun";
import { and, asc, desc, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { DEFAULT_STATUS_THRESHOLDS } from "../shared/status-thresholds.constants";
import type { StatusThresholds } from "../shared/status-thresholds.constants";

const e35 = alias(etapas, "e35");
const e13 = alias(etapas, "e13");
const e18 = alias(etapas, "e18");
const ins = alias(usuarios, "ins");

export function listInstallationCompletionProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e35.datahoraAberturaEtapa}))`;

  return topsunDb
    .select({
      agendamentoInstalacaoFinal: e18.data2Etapa,
      agendamentoInstalacaoInicio: e18.data1Etapa,
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      diasEtapa: diasEtapa.as("dias_etapa"),
      instalador: ins.idUsuario,
      instaladorNome: ins.nomeUsuario,
      obsEtapa: e35.obsEtapa,
      projeto: coletaDados.idColeta,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .leftJoin(
      e35,
      and(eq(coletaDados.idColeta, e35.codColetaEtapa), eq(e35.codCfgEtapa, 35))
    )
    .leftJoin(
      e13,
      and(eq(coletaDados.idColeta, e13.codColetaEtapa), eq(e13.codCfgEtapa, 13))
    )
    .leftJoin(
      e18,
      and(eq(coletaDados.idColeta, e18.codColetaEtapa), eq(e18.codCfgEtapa, 18))
    )
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .leftJoin(usuarios, eq(coletaDados.vendedorColeta, usuarios.idUsuario))
    .innerJoin(
      dadosEmissaoContrato,
      eq(dadosEmissaoContrato.codColetaEmissao, coletaDados.idColeta)
    )
    .innerJoin(ins, eq(ins.idUsuario, dadosEmissaoContrato.instaladorEmissao))
    .where(
      and(
        eq(e35.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e35.bloqueadaEtapa, 0),
        isNotNull(e35.datahoraAberturaEtapa)
      )
    )
    .orderBy(desc(diasEtapa), asc(coletaDados.idColeta));
}

export async function getInstallationCompletionStatusThresholds(): Promise<StatusThresholds> {
  const [row] = await postgresDb
    .select({
      attention: installationCompletionStatusThresholds.attention,
      critical: installationCompletionStatusThresholds.critical,
      onTime: installationCompletionStatusThresholds.onTime,
    })
    .from(installationCompletionStatusThresholds)
    .limit(1);

  return row ?? DEFAULT_STATUS_THRESHOLDS;
}

export async function upsertInstallationCompletionStatusThresholds(
  values: Pick<
    InstallationCompletionStatusThresholds,
    "attention" | "critical" | "onTime"
  >
) {
  const [row] = await postgresDb
    .insert(installationCompletionStatusThresholds)
    .values({ id: INSTALLATION_COMPLETION_STATUS_THRESHOLDS_ID, ...values })
    .onConflictDoUpdate({
      set: {
        attention: values.attention,
        critical: values.critical,
        onTime: values.onTime,
      },
      target: installationCompletionStatusThresholds.id,
    })
    .returning({
      attention: installationCompletionStatusThresholds.attention,
      critical: installationCompletionStatusThresholds.critical,
      onTime: installationCompletionStatusThresholds.onTime,
    });

  return row;
}
