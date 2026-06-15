"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api";
import { cn } from "@topsun/ui/lib/utils";

import { getProjectStatusClassName } from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { DataTable } from "@/shared/components/data-table";
import { formatLocalizedDate } from "@/shared/utils/format-date";
import { formatValue } from "@/shared/utils/format-value";

type ProjectOnUtilityInspectionRequest =
  RouterOutputs["utilityInspectionRequest"]["getProjects"][number];

function createProjectsOnUtilityInspectionRequestColumns(
  thresholds: ProjectStatusThresholds
): ColumnDef<ProjectOnUtilityInspectionRequest>[] {
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
      accessorKey: "aprovacaoCredito",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Aprovação crédito",
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

interface UtilityInspectionRequestDataTableProps {
  data: ProjectOnUtilityInspectionRequest[];
  pageSize?: number;
  thresholds: ProjectStatusThresholds;
}

export function UtilityInspectionRequestDataTable({
  data,
  pageSize = 15,
  thresholds,
}: UtilityInspectionRequestDataTableProps) {
  return (
    <DataTable
      columns={createProjectsOnUtilityInspectionRequestColumns(thresholds)}
      data={data}
      pageSize={pageSize}
    />
  );
}
