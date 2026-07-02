import { topsunDb } from "@topsun/db";
import {
  clientes,
  coletaDados,
  etapas,
  regioesVenda,
  usuarios,
} from "@topsun/db/schema/topsun";
import {
  and,
  asc,
  desc,
  eq,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";

const e42 = alias(etapas, "e42");
const e4 = alias(etapas, "e4");
const e13 = alias(etapas, "e13");
const e19 = alias(etapas, "e19");

export function listAutomationRequestProtocolProjects() {
  const diasEtapa = sql<number>`DATEDIFF(CURDATE(), DATE(${e42.datahoraAberturaEtapa}))`;

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
      cpfCnpj: clientes.cpfcnpjCliente,
      dataFaturamento: sql<string>`DATE(${e19.data1Etapa})`.as(
        "data_faturamento"
      ),
      diasEtapa: diasEtapa.as("dias_etapa"),
      emailCliente: clientes.emailCliente,
      estadoInstalacao: coletaDados.estadoUcColeta,
      fechamentoVenda: sql<string>`DATE(${e4.datahoraAberturaEtapa})`.as(
        "fechamento_venda"
      ),
      nascAberturaCliente: clientes.nascAberturaCliente,
      obsEtapa: e42.obsEtapa,
      projeto: coletaDados.idColeta,
      regional: regioesVenda.nomeRegiaoVenda,
      representante: usuarios.nomeUsuario,
      unidadeConsumidora: coletaDados.ucPrincipalColeta,
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
        isNotNull(e42.datahoraAberturaEtapa),
        like(coletaDados.concessionariaColeta, "%CELESC%"),
        or(isNull(e42.obsEtapa), eq(e42.obsEtapa, ""))
      )
    )
    .orderBy(desc(diasEtapa), asc(coletaDados.idColeta));
}

export type RequestProtocolProject = Awaited<
  ReturnType<typeof listAutomationRequestProtocolProjects>
>[number];

export function getColetaDadosByUnidadeConsumidora(unidadeConsumidora: string) {
  return topsunDb
    .select({
      idColeta: coletaDados.idColeta,
      nomeCliente: clientes.nomeCliente,
    })
    .from(coletaDados)
    .leftJoin(clientes, eq(coletaDados.clienteColeta, clientes.idCliente))
    .where(eq(coletaDados.ucPrincipalColeta, unidadeConsumidora));
}

export function listProtocolReturnProjectsByClientNames(clientNames: string[]) {
  const names = clientNames
    .map((clientName) => clientName.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return Promise.resolve([]);
  }

  return topsunDb
    .select({
      bloqueadaEtapa: etapas.bloqueadaEtapa,
      campopadraoEtapa: etapas.campopadraoEtapa,
      datahoraConclusaoEtapa: etapas.datahoraConclusaoEtapa,
      idColeta: coletaDados.idColeta,
      nomeCliente: clientes.nomeCliente,
      statusEtapa: etapas.statusEtapa,
    })
    .from(etapas)
    .leftJoin(coletaDados, eq(coletaDados.idColeta, etapas.codColetaEtapa))
    .leftJoin(clientes, eq(clientes.idCliente, coletaDados.clienteColeta))
    .where(
      and(
        eq(etapas.codCfgEtapa, 42),
        eq(coletaDados.statusColeta, 2),
        or(
          ...names.map((clientName) =>
            like(clientes.nomeCliente, `%${clientName}%`)
          )
        )
      )
    );
}

export function listOpenProtocolProjectsByClientNames(clientNames: string[]) {
  const names = clientNames
    .map((clientName) => clientName.trim())
    .filter(Boolean);

  if (names.length === 0) {
    return Promise.resolve([]);
  }

  return topsunDb
    .select({
      idColeta: coletaDados.idColeta,
      nomeCliente: clientes.nomeCliente,
    })
    .from(etapas)
    .leftJoin(coletaDados, eq(coletaDados.idColeta, etapas.codColetaEtapa))
    .leftJoin(clientes, eq(clientes.idCliente, coletaDados.clienteColeta))
    .where(
      and(
        eq(etapas.codCfgEtapa, 42),
        isNull(etapas.datahoraConclusaoEtapa),
        eq(etapas.statusEtapa, 0),
        eq(coletaDados.statusColeta, 2),
        eq(etapas.bloqueadaEtapa, 0),
        or(
          ...names.map((clientName) =>
            like(clientes.nomeCliente, `%${clientName}%`)
          )
        )
      )
    );
}
