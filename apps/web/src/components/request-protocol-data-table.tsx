"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { cn } from "@topsun/ui/lib/utils";

import { DataTable } from "@/components/data-table";
import { formatLocalizedDate } from "@/utils/format-date";
import { getProjectStatusClassName } from "@/utils/project-status";
import type { RequestProtocolStatusThresholds } from "@/utils/project-status";
import { formatValue } from "@/utils/table";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

function createProjectsOnRequestProtocolColumns(
  thresholds: RequestProtocolStatusThresholds
): ColumnDef<ProjectOnRequestProtocol>[] {
  return [
    {
      accessorKey: "projeto",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return <span className="font-medium">{formatValue(value)}</span>;
      },
      header: "Projeto",
      size: 75,
    },
    {
      accessorKey: "cliente",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Cliente",
    },
    {
      accessorKey: "cidadeInstalacao",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Cidade",
    },
    {
      accessorKey: "concessionaria",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Concessionária",
    },
    {
      accessorKey: "representante",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Representante",
    },
    {
      accessorKey: "regional",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Regional",
    },
    {
      accessorKey: "aberturaEtapa",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Abertura da Etapa",
    },
    {
      accessorKey: "fechamentoVenda",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Fechamento da Venda",
    },
    {
      accessorKey: "aprovacaoCredito",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Aprovação Crédito",
    },
    {
      accessorKey: "dataFaturamento",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Data do Faturamento",
    },
    {
      accessorKey: "diasEtapa",
      cell: ({ getValue }) => {
        const value = getValue<number>();

        const statusClassName = getProjectStatusClassName(value, thresholds);

        return (
          <span
            className={cn(
              "inline-flex min-w-8 items-center justify-center rounded-lg px-2 py-0.5 font-medium tabular-nums",
              statusClassName
            )}
          >
            {formatValue(value)}
          </span>
        );
      },
      header: "Dias na Etapa",
    },
    {
      accessorKey: "obsEtapa",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Observação da Etapa",
      size: 256,
    },
  ];
}

interface RequestProtocolDataTableProps {
  data: ProjectOnRequestProtocol[];
  pageSize?: number;
  thresholds: RequestProtocolStatusThresholds;
}

export function RequestProtocolDataTable({
  data,
  pageSize = 15,
  thresholds,
}: RequestProtocolDataTableProps) {
  return (
    <DataTable
      columns={createProjectsOnRequestProtocolColumns(thresholds)}
      data={data}
      pageSize={pageSize}
    />
  );
}
