"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api";
import { cn } from "@topsun/ui/lib/utils";

import { getProjectStatusClassName } from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { DataTable } from "@/shared/components/data-table";
import { formatLocalizedDate } from "@/shared/utils/format-date";
import { formatValue } from "@/shared/utils/format-value";

type ProjectOnTechnicalInspectionValidation =
  RouterOutputs["technicalInspectionValidation"]["getProjects"][number];

function createProjectsOnTechnicalInspectionValidationColumns(
  thresholds: ProjectStatusThresholds
): ColumnDef<ProjectOnTechnicalInspectionValidation>[] {
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
      accessorKey: "aprovacaoCredito",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Aprovação crédito",
    },
    {
      accessorKey: "fechamentoVenda",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Fechamento venda",
    },
    {
      accessorKey: "aberturaEtapa",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatLocalizedDate(value);
      },
      header: "Abertura etapa",
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
  ];
}

interface TechnicalInspectionValidationDataTableProps {
  data: ProjectOnTechnicalInspectionValidation[];
  pageSize?: number;
  thresholds: ProjectStatusThresholds;
}

export function TechnicalInspectionValidationDataTable({
  data,
  pageSize = 15,
  thresholds,
}: TechnicalInspectionValidationDataTableProps) {
  return (
    <DataTable
      columns={createProjectsOnTechnicalInspectionValidationColumns(thresholds)}
      data={data}
      pageSize={pageSize}
    />
  );
}
