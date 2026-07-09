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
  VerifyApproveRequestAccessReportRow,
  VerifyInspectionRequestReportRow,
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

const VERIFY_STEP_STATUS_CLASSNAME = {
  ERROR:
    "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
  NOT_APPLICABLE:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  SUCESS:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

const VERIFY_STEP_STATUS_LABEL = {
  ERROR: "Erro",
  NOT_APPLICABLE: "Em andamento",
  SUCESS: "Sucesso",
} as const;

type VerifyStepStatus = keyof typeof VERIFY_STEP_STATUS_CLASSNAME;

function isVerifyStepStatus(status: string): status is VerifyStepStatus {
  return status in VERIFY_STEP_STATUS_CLASSNAME;
}

const NETWORK_ANALYSIS_STEP_MESSAGE =
  "Projeto liberado com necessidade de análise de rede.";

const NETWORK_ANALYSIS_STATUS_LABEL = "Análise de rede";

const NETWORK_ANALYSIS_STATUS_CLASSNAME =
  "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400";

function isNetworkAnalysisStepMessage(stepMessage: string | null): boolean {
  return stepMessage === NETWORK_ANALYSIS_STEP_MESSAGE;
}

function getVerifyApproveTableStatusLabel(
  row: VerifyApproveRequestAccessReportRow
): string | null {
  if (isNetworkAnalysisStepMessage(row.latest_step_message)) {
    return NETWORK_ANALYSIS_STATUS_LABEL;
  }

  const status = row.latest_step_status;

  if (!status) {
    return null;
  }

  if (isVerifyStepStatus(status)) {
    return VERIFY_STEP_STATUS_LABEL[status];
  }

  return status;
}

const VERIFY_APPROVE_FILTER_LABELS = [
  VERIFY_STEP_STATUS_LABEL.SUCESS,
  VERIFY_STEP_STATUS_LABEL.NOT_APPLICABLE,
  VERIFY_STEP_STATUS_LABEL.ERROR,
  NETWORK_ANALYSIS_STATUS_LABEL,
] as const;

type VerifyApproveFilterLabel = (typeof VERIFY_APPROVE_FILTER_LABELS)[number];

function isVerifyApproveFilterLabel(
  label: string
): label is VerifyApproveFilterLabel {
  return VERIFY_APPROVE_FILTER_LABELS.includes(
    label as VerifyApproveFilterLabel
  );
}

function VerifyStepStatusBadge({ status }: { status: string }) {
  if (!isVerifyStepStatus(status)) {
    return (
      <Badge className="font-normal" variant="outline">
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      className={cn(
        "gap-1.5 font-normal",
        VERIFY_STEP_STATUS_CLASSNAME[status]
      )}
      variant="outline"
    >
      {VERIFY_STEP_STATUS_LABEL[status]}
    </Badge>
  );
}

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
      accessorKey: "email_date",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatValue(getValue<string | null>())}
        </span>
      ),
      header: "Data e-mail",
      size: 140,
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

function capitalizeFirstLetter(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function createVerifyApproveRequestAccessColumns(): ColumnDef<VerifyApproveRequestAccessReportRow>[] {
  return [
    createProjectColumn<VerifyApproveRequestAccessReportRow>({
      enableSorting: true,
    }),
    createClientColumn<VerifyApproveRequestAccessReportRow>({
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
      accessorKey: "solicitante",
      cell: ({ getValue }) => {
        const solicitante = getValue<string | null>();

        return formatValue(
          solicitante ? capitalizeFirstLetter(solicitante) : null
        );
      },
      header: "Solicitante",
      size: 120,
    },
    {
      accessorKey: "latest_step_status",
      cell: ({ row }) => {
        if (isNetworkAnalysisStepMessage(row.original.latest_step_message)) {
          return (
            <Badge
              className={cn(
                "gap-1.5 font-normal",
                NETWORK_ANALYSIS_STATUS_CLASSNAME
              )}
              variant="outline"
            >
              {NETWORK_ANALYSIS_STATUS_LABEL}
            </Badge>
          );
        }

        const status = row.original.latest_step_status;

        if (!status) {
          return <span className="text-muted-foreground">—</span>;
        }

        return <VerifyStepStatusBadge status={status} />;
      },
      enableSorting: true,
      header: "Último status",
      size: 160,
      sortingFn: (currentRow, nextRow) =>
        (
          getVerifyApproveTableStatusLabel(currentRow.original) ?? ""
        ).localeCompare(
          getVerifyApproveTableStatusLabel(nextRow.original) ?? "",
          "pt-BR"
        ),
    },
    {
      accessorKey: "latest_step_date",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatValue(getValue<string | null>())}
        </span>
      ),
      header: "Data",
      size: 140,
    },
    {
      accessorFn: (row) => {
        if (row.status === "Erro" && row.error_message) {
          return row.error_message;
        }

        return row.latest_rejection_reasons ?? row.latest_step_message ?? "";
      },
      cell: ({ row }) => {
        const {
          error_message: errorMessage,
          latest_rejection_reasons: rejectionReasons,
          latest_step_message: stepMessage,
          status,
        } = row.original;

        if (status === "Erro" && errorMessage) {
          return (
            <span className="text-destructive">
              {formatValue(errorMessage)}
            </span>
          );
        }

        return rejectionReasons ?? formatValue(stepMessage);
      },
      header: "Última mensagem",
      id: "latest_step_message",
      size: 360,
    },
  ];
}

function VerifyApproveRequestAccessDataTable({
  pageSize,
  rows,
}: {
  pageSize: number;
  rows: VerifyApproveRequestAccessReportRow[];
}) {
  const [visibleStatuses, setVisibleStatuses] = useState<
    Set<VerifyApproveFilterLabel>
  >(() => new Set());

  const filteredRows =
    visibleStatuses.size === 0
      ? rows
      : rows.filter((row) => {
          const label = getVerifyApproveTableStatusLabel(row);

          return (
            label !== null &&
            isVerifyApproveFilterLabel(label) &&
            visibleStatuses.has(label)
          );
        });
  const rowsByProject = filteredRows.toSorted(
    (currentRow, nextRow) => currentRow.projeto - nextRow.projeto
  );

  function toggleStatus(status: VerifyApproveFilterLabel, isChecked: boolean) {
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
            {VERIFY_APPROVE_FILTER_LABELS.map((status) => (
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
        columns={createVerifyApproveRequestAccessColumns()}
        data={rowsByProject}
        pageSize={pageSize}
      />
    </div>
  );
}

function createVerifyInspectionRequestColumns(): ColumnDef<VerifyInspectionRequestReportRow>[] {
  return [
    createProjectColumn<VerifyInspectionRequestReportRow>({
      enableSorting: true,
    }),
    createClientColumn<VerifyInspectionRequestReportRow>({
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
      accessorKey: "solicitante",
      cell: ({ getValue }) => {
        const solicitante = getValue<string | null>();

        return formatValue(
          solicitante ? capitalizeFirstLetter(solicitante) : null
        );
      },
      header: "Solicitante",
      size: 120,
    },
    {
      accessorKey: "ultimo_status",
      cell: ({ getValue }) => formatValue(getValue<string | null>()),
      enableSorting: true,
      header: "Último status",
      size: 280,
    },
    {
      accessorKey: "data",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatValue(getValue<string | null>())}
        </span>
      ),
      header: "Data",
      size: 140,
    },
  ];
}

function VerifyInspectionRequestDataTable({
  pageSize,
  rows,
}: {
  pageSize: number;
  rows: VerifyInspectionRequestReportRow[];
}) {
  const rowsByProject = rows.toSorted(
    (currentRow, nextRow) => currentRow.projeto - nextRow.projeto
  );

  return (
    <DataTable
      columns={createVerifyInspectionRequestColumns()}
      data={rowsByProject}
      pageSize={pageSize}
    />
  );
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

  if (report.kind === "verify_approve_request_access") {
    return (
      <VerifyApproveRequestAccessDataTable
        pageSize={pageSize}
        rows={report.rows}
      />
    );
  }

  if (report.kind === "verify_inspection_request") {
    return (
      <VerifyInspectionRequestDataTable
        pageSize={pageSize}
        rows={report.rows}
      />
    );
  }

  return null;
}
