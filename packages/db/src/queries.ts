import { and, asc, eq, gt, ne, sql } from "drizzle-orm";
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
        gt(coletaDados.statusColeta, 1),
        ne(coletaDados.statusColeta, 3)
      )
    )
    .orderBy(asc(coletaDados.idColeta));
}

export type ProjectOnRequestProtocol = Awaited<
  ReturnType<typeof getProjectsOnRequestProtocol>
>[number];
