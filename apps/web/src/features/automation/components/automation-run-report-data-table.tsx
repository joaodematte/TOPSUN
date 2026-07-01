"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@topsun/ui/components/badge";
import { cn } from "@topsun/ui/lib/utils";

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
  Erro: "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
  Sucesso:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

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

function createProjectColumn<T>(): ColumnDef<T> {
  return {
    accessorKey: "projeto",
    cell: ({ getValue }) => (
      <span className="font-medium tabular-nums">
        {formatValue(getValue<number>())}
      </span>
    ),
    header: "Projeto",
    size: 100,
  };
}

function createClientColumn<T>(): ColumnDef<T> {
  return {
    accessorKey: "cliente",
    cell: ({ getValue }) => formatValue(getValue<string | null>()),
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
    createProjectColumn<ValidateProtocolReturnReportRow>(),
    createClientColumn<ValidateProtocolReturnReportRow>(),
    {
      accessorKey: "status",
      cell: ({ getValue }) => (
        <ValidateStatusBadge
          status={getValue<ValidateProtocolReturnReportRow["status"]>()}
        />
      ),
      header: "Status",
      size: 140,
    },
    {
      accessorKey: "error_message",
      cell: ({ getValue }) => formatValue(getValue<string | null>()),
      header: "Mensagem de erro",
      size: 320,
    },
  ];
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
      <DataTable
        columns={createValidateProtocolReturnColumns()}
        data={report.rows}
        pageSize={pageSize}
      />
    );
  }

  return null;
}
