import { and, asc, eq, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

import { topsunDb } from ".";
import {
  clientes,
  coletaDados,
  etapas,
  regioesVenda,
  usuarios,
} from "./schema/topsun";

const e42 = alias(etapas, "e42");
const e4 = alias(etapas, "e4");
const e13 = alias(etapas, "e13");
const e19 = alias(etapas, "e19");
const e22 = alias(etapas, "e22");
const e24 = alias(etapas, "e24");

export function getProjectsOnRequestProtocol() {
  return topsunDb
    .select({
      aberturaEtapa: sql<string>`DATE(${e42.datahoraAberturaEtapa})`.as(
        "abertura_etapa"
      ),
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      dataFaturamento: sql<string>`DATE(${e19.data1Etapa})`.as(
        "data_faturamento"
      ),
      diasEtapa:
        sql<number>`DATEDIFF(CURDATE(), DATE(${e42.datahoraAberturaEtapa}))`.as(
          "dias_etapa"
        ),
      estadoInstalacao: coletaDados.estadoUcColeta,
      fechamentoVenda: sql<string>`DATE(${e4.datahoraAberturaEtapa})`.as(
        "fechamento_venda"
      ),
      obsEtapa: e42.obsEtapa,
      projeto: coletaDados.idColeta,
      regional: regioesVenda.nomeRegiaoVenda,
      representante: usuarios.nomeUsuario,
    })
    .from(coletaDados)
    .innerJoin(
      e42,
      and(eq(coletaDados.idColeta, e42.codColetaEtapa), eq(e42.codCfgEtapa, 42))
    )
    .leftJoin(
      e4,
      and(eq(coletaDados.idColeta, e4.codColetaEtapa), eq(e4.codCfgEtapa, 1))
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
    .innerJoin(
      regioesVenda,
      eq(coletaDados.regiaoVendaColeta, regioesVenda.idRegiaoVenda)
    )
    .where(
      and(
        eq(e42.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(e42.bloqueadaEtapa, 0),
        isNotNull(e42.datahoraAberturaEtapa)
      )
    )
    .orderBy(asc(coletaDados.idColeta));
}

export type ProjectOnRequestProtocol = Awaited<
  ReturnType<typeof getProjectsOnRequestProtocol>
>[number];

export function getProjectsOnInspectionApprovalConcessionary() {
  return topsunDb
    .select({
      aprovacaoCredito: sql<string>`DATE(${e13.datahoraConclusaoEtapa})`.as(
        "aprovacao_credito"
      ),
      cidadeInstalacao: coletaDados.cidadeUcColeta,
      cliente: clientes.nomeCliente,
      concessionaria: coletaDados.concessionariaColeta,
      diasEtapa:
        sql<number>`DATEDIFF(CURDATE(), DATE(${e24.datahoraAberturaEtapa}))`.as(
          "dias_etapa"
        ),
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
    .orderBy(asc(coletaDados.idColeta));
}

export type ProjectOnInspectionApprovalConcessionary = Awaited<
  ReturnType<typeof getProjectsOnInspectionApprovalConcessionary>
>[number];
