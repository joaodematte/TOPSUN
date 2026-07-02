"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@topsun/ui/components/badge";
import { Button } from "@topsun/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@topsun/ui/components/dropdown-menu";
import { cn } from "@topsun/ui/lib/utils";
import { useState } from "react";

import type { AutomationKind } from "@/features/automation/config";
import type {
  AutomationRunReport,
  RequestProtocolReportRow,
  ValidateProtocolReturnReportRow,
} from "@/features/automation/types";
import { DataTable } from "@/shared/components/data-table";
import { formatValue } from "@/shared/utils/format-value";

const SYSTEM_STATUS_CLASSNAME = {
  ERRO: "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
  IGNORADO:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  OK: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

const VALIDATE_STATUS_CLASSNAME = {
  Divergência:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  "Falha TOPSUN":
    "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
  "Já inserido": "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
  Manual: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "Não encontrado":
    "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
  Sucesso:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

const VALIDATE_STATUS_OPTIONS = Object.keys(
  VALIDATE_STATUS_CLASSNAME
) as ValidateProtocolReturnReportRow["status"][];

function getSystemStatusLabel(
  status: keyof typeof SYSTEM_STATUS_CLASSNAME
): string {
  if (status === "OK") {
    return "Sucesso";
  }

  if (status === "ERRO") {
    return "Erro";
  }

  return "Ignorado";
}

function SystemStatusBadge({
  status,
}: {
  status: keyof typeof SYSTEM_STATUS_CLASSNAME;
}) {
  return (
    <Badge
      className={cn("gap-1.5", SYSTEM_STATUS_CLASSNAME[status])}
      variant="outline"
    >
      {getSystemStatusLabel(status)}
    </Badge>
  );
}

function ValidateStatusBadge({
  status,
}: {
  status: ValidateProtocolReturnReportRow["status"];
}) {
  return (
    <Badge
      className={cn("gap-1.5", VALIDATE_STATUS_CLASSNAME[status])}
      variant="outline"
    >
      {status}
    </Badge>
  );
}

function createProjectColumn<T>({
  enableSorting = false,
}: {
  enableSorting?: boolean;
} = {}): ColumnDef<T> {
  return {
    accessorKey: "projeto",
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        {formatValue(getValue<number>())}
      </span>
    ),
    enableSorting,
    header: "Projeto",
    size: 100,
  };
}

function createClientColumn<T>({
  enableSorting = false,
}: {
  enableSorting?: boolean;
} = {}): ColumnDef<T> {
  return {
    accessorKey: "cliente",
    cell: ({ getValue }) => formatValue(getValue<string | null>()),
    enableSorting,
    header: "Cliente",
  };
}

function createRequestProtocolColumns(): ColumnDef<RequestProtocolReportRow>[] {
  return [
    createProjectColumn<RequestProtocolReportRow>(),
    createClientColumn<RequestProtocolReportRow>(),
    {
      accessorKey: "solicitadoNaCelesc",
      cell: ({ getValue }) => (
        <SystemStatusBadge
          status={getValue<RequestProtocolReportRow["solicitadoNaCelesc"]>()}
        />
      ),
      header: "Solicitado na CELESC",
      size: 180,
    },
    {
      accessorKey: "atualizadoNoSistemaTopsun",
      cell: ({ getValue }) => (
        <SystemStatusBadge
          status={getValue<
            RequestProtocolReportRow["atualizadoNoSistemaTopsun"]
          >()}
        />
      ),
      header: "Atualizado no sistema TOPSUN",
      size: 220,
    },
  ];
}

function createValidateProtocolReturnColumns(): ColumnDef<ValidateProtocolReturnReportRow>[] {
  return [
    createProjectColumn<ValidateProtocolReturnReportRow>({
      enableSorting: true,
    }),
    createClientColumn<ValidateProtocolReturnReportRow>({
      enableSorting: true,
    }),
    {
      accessorKey: "protocol_number",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">
          {formatValue(getValue<string | null>())}
        </span>
      ),
      enableSorting: true,
      header: "Protocolo",
      size: 160,
      sortingFn: (currentRow, nextRow) =>
        String(currentRow.original.protocol_number ?? "").localeCompare(
          String(nextRow.original.protocol_number ?? ""),
          "pt-BR",
          { numeric: true }
        ),
    },
    {
      accessorKey: "status",
      cell: ({ getValue }) => (
        <ValidateStatusBadge
          status={getValue<ValidateProtocolReturnReportRow["status"]>()}
        />
      ),
      enableSorting: true,
      header: "Status",
      size: 180,
    },
    {
      accessorKey: "error_message",
      cell: ({ getValue }) => formatValue(getValue<string | null>()),
      header: "Mensagem",
      size: 320,
    },
  ];
}

function ValidateProtocolReturnDataTable({
  pageSize,
  rows,
}: {
  pageSize: number;
  rows: ValidateProtocolReturnReportRow[];
}) {
  const [visibleStatuses, setVisibleStatuses] = useState<
    Set<ValidateProtocolReturnReportRow["status"]>
  >(() => new Set());

  const filteredRows =
    visibleStatuses.size === 0
      ? rows
      : rows.filter((row) => visibleStatuses.has(row.status));
  const rowsByProject = filteredRows.toSorted(
    (currentRow, nextRow) => currentRow.projeto - nextRow.projeto
  );

  function toggleStatus(
    status: ValidateProtocolReturnReportRow["status"],
    isChecked: boolean
  ) {
    setVisibleStatuses((currentStatuses) => {
      const nextStatuses = new Set(currentStatuses);

      if (isChecked) {
        nextStatuses.add(status);
        return nextStatuses;
      }

      nextStatuses.delete(status);
      return nextStatuses;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button className="ml-auto" type="button" variant="outline">
                Status
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            {VALIDATE_STATUS_OPTIONS.map((status) => (
              <DropdownMenuCheckboxItem
                checked={visibleStatuses.has(status)}
                key={status}
                onCheckedChange={(value) =>
                  toggleStatus(status, Boolean(value))
                }
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable
        columns={createValidateProtocolReturnColumns()}
        data={rowsByProject}
        pageSize={pageSize}
      />
    </div>
  );
}

interface AutomationRunReportDataTableProps {
  kind: AutomationKind;
  report: AutomationRunReport;
  pageSize?: number;
}

export function AutomationRunReportDataTable({
  kind,
  pageSize = 15,
  report,
}: AutomationRunReportDataTableProps) {
  if (kind === "request_protocol" && report.kind === "request_protocol") {
    return (
      <DataTable
        columns={createRequestProtocolColumns()}
        data={report.rows}
        pageSize={pageSize}
      />
    );
  }

  if (report.kind === "validate_protocol_return") {
    return (
      <ValidateProtocolReturnDataTable pageSize={pageSize} rows={report.rows} />
    );
  }

  return null;
}
