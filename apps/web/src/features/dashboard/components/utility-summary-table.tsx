"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatAverageDays } from "@/features/dashboard/utils/utility-summary";
import type { UtilitySummaryRow } from "@/features/dashboard/utils/utility-summary";
import { DataTable } from "@/shared/components/data-table";
import { formatValue } from "@/shared/utils/format-value";

const REQUESTED_MOCK = "—";

const numericCellClassName = "block text-right tabular-nums";

const baseUtilitySummaryColumns: ColumnDef<UtilitySummaryRow>[] = [
  {
    accessorKey: "concessionaria",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{formatValue(value)}</span>;
    },
    header: "Concessionária",
  },
  {
    accessorKey: "total",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Total</div>,
    size: 75,
  },
  {
    accessorKey: "onTime",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">No prazo</div>,
    size: 75,
  },
  {
    accessorKey: "attention",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Atenção</div>,
    size: 75,
  },
  {
    accessorKey: "critical",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Caminho crítico</div>,
    size: 75,
  },
  {
    accessorKey: "overdue",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Atrasado</div>,
    size: 75,
  },
];

const solicitadoMockColumn: ColumnDef<UtilitySummaryRow> = {
  cell: () => <span className={numericCellClassName}>{REQUESTED_MOCK}</span>,
  header: () => <div className="text-right">Solicitado</div>,
  id: "prSolicitado",
  size: 75,
};

const solicitadoRealColumn: ColumnDef<UtilitySummaryRow> = {
  accessorKey: "solicitado",
  cell: ({ getValue }) => (
    <span className={numericCellClassName}>{getValue<number>()}</span>
  ),
  header: () => <div className="text-right">Solicitado</div>,
  size: 75,
};

const mediaDiasColumn: ColumnDef<UtilitySummaryRow> = {
  accessorKey: "mediaDias",
  cell: ({ getValue }) => (
    <span className={numericCellClassName}>
      {formatAverageDays(getValue<number>())}
    </span>
  ),
  header: () => <div className="text-right">Média Dias</div>,
  size: 75,
};

interface UtilitySummaryTableProps {
  data: UtilitySummaryRow[];
  useRealSolicitado?: boolean;
}

export function UtilitySummaryTable({
  data,
  useRealSolicitado = false,
}: UtilitySummaryTableProps) {
  const solicitadoColumn = useRealSolicitado
    ? solicitadoRealColumn
    : solicitadoMockColumn;

  const columns = [
    ...baseUtilitySummaryColumns,
    solicitadoColumn,
    mediaDiasColumn,
  ];

  return <DataTable columns={columns} data={data} pageSize={5} />;
}
