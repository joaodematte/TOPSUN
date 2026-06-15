"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { RouterOutputs } from "@topsun/api/routers/index";
import { cn } from "@topsun/ui/lib/utils";

import { DataTable } from "@/components/data-table";
import { formatLocalizedDate } from "@/utils/format-date";
import { getProjectStatusClassName } from "@/utils/project-status";
import type { ProjectStatusThresholds } from "@/utils/project-status";
import { formatValue } from "@/utils/table";

type ProjectOnInspectionApproval =
  RouterOutputs["inspectionApproval"]["getProjects"][number];

function createProjectsOnInspectionApprovalColumns(
  thresholds: ProjectStatusThresholds
): ColumnDef<ProjectOnInspectionApproval>[] {
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
      accessorKey: "protocolo",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Protocolo",
    },
    {
      accessorKey: "obsAprovVistoria",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Obs. aprovação vistoria",
      size: 256,
    },
    {
      accessorKey: "obsSolicVistoria",
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return formatValue(value);
      },
      header: "Obs. solicitação vistoria",
      size: 256,
    },
  ];
}

interface InspectionApprovalDataTableProps {
  data: ProjectOnInspectionApproval[];
  pageSize?: number;
  thresholds: ProjectStatusThresholds;
}

export function InspectionApprovalDataTable({
  data,
  pageSize = 15,
  thresholds,
}: InspectionApprovalDataTableProps) {
  return (
    <DataTable
      columns={createProjectsOnInspectionApprovalColumns(thresholds)}
      data={data}
      pageSize={pageSize}
    />
  );
}
