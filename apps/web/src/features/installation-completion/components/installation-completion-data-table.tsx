"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api";
import { cn } from "@topsun/ui/lib/utils";

import { getProjectStatusClassName } from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { DataTable } from "@/shared/components/data-table";
import { formatLocalizedDate } from "@/shared/utils/format-date";
import { formatValue } from "@/shared/utils/format-value";

type ProjectOnInstallationCompletion =
  RouterOutputs["installationCompletion"]["getProjects"][number];

function createProjectsOnInstallationCompletionColumns(
  thresholds: ProjectStatusThresholds
): ColumnDef<ProjectOnInstallationCompletion>[] {
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
      accessorKey: "representante",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Representante",
    },
    {
      accessorKey: "instaladorNome",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Instalador",
    },
    {
      accessorKey: "aprovacaoCredito",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Aprovação crédito",
    },
    {
      accessorKey: "agendamentoInstalacaoInicio",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Agend. instalação início",
    },
    {
      accessorKey: "agendamentoInstalacaoFinal",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Agend. instalação final",
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
      header: "Dias na etapa",
    },
    {
      accessorKey: "obsEtapa",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Observação da etapa",
      size: 256,
    },
  ];
}

interface InstallationCompletionDataTableProps {
  data: ProjectOnInstallationCompletion[];
  pageSize?: number;
  thresholds: ProjectStatusThresholds;
}

export function InstallationCompletionDataTable({
  data,
  pageSize = 15,
  thresholds,
}: InstallationCompletionDataTableProps) {
  return (
    <DataTable
      columns={createProjectsOnInstallationCompletionColumns(thresholds)}
      data={data}
      pageSize={pageSize}
    />
  );
}
