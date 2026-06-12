"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api/routers/index";

import { DataTable } from "@/components/data-table";
import { formatLocalizedDate } from "@/utils/format-date";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

function isValueEmpty(value: string | number | null | undefined): boolean {
  return value === null || value === undefined || value === "";
}

const utilityOverviewColumns: ColumnDef<ProjectOnRequestProtocol>[] = [
  {
    accessorKey: "projeto",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Projeto",
  },
  {
    accessorKey: "cliente",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Cliente",
  },
  {
    accessorKey: "cidadeInstalacao",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Cidade",
  },
  {
    accessorKey: "concessionaria",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Concessionária",
  },
  {
    accessorKey: "representante",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Representante",
  },
  {
    accessorKey: "regional",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Regional",
  },
  {
    accessorKey: "aberturaEtapa",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : formatLocalizedDate(value);
    },
    header: "Abertura da Etapa",
  },
  {
    accessorKey: "fechamentoVenda",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : formatLocalizedDate(value);
    },
    header: "Fechamento da Venda",
  },
  {
    accessorKey: "aprovacaoCredito",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : formatLocalizedDate(value);
    },
    header: "Aprovação Crédito",
  },
  {
    accessorKey: "dataFaturamento",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : formatLocalizedDate(value);
    },
    header: "Data do Faturamento",
  },
  {
    accessorKey: "diasEtapa",
    cell: ({ getValue }) => {
      const value = getValue<number>();
      return isValueEmpty(value) ? "—" : value.toString();
    },
    header: "Dias na Etapa",
  },
  {
    accessorKey: "obsEtapa",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return isValueEmpty(value) ? "—" : value;
    },
    header: "Observação da Etapa",
    size: 256,
  },
];

interface UtilityOverviewProps {
  data: ProjectOnRequestProtocol[];
}

export function UtilityOverview({ data }: UtilityOverviewProps) {
  return <DataTable columns={utilityOverviewColumns} data={data} />;
}
