"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { formatValue } from "@/utils/table";
import { formatAverageDays } from "@/utils/utility-summary";
import type { UtilitySummaryRow } from "@/utils/utility-summary";

const REQUESTED_MOCK = "—";

const numericCellClassName = "block text-right tabular-nums";

const utilitySummaryColumns: ColumnDef<UtilitySummaryRow>[] = [
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
    header: () => <div className="text-right">Crítico</div>,
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
  {
    cell: () => <span className={numericCellClassName}>{REQUESTED_MOCK}</span>,
    header: () => <div className="text-right">Solicitado</div>,
    id: "prSolicitado",
    size: 75,
  },
  {
    accessorKey: "mediaDias",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>
        {formatAverageDays(getValue<number>())}
      </span>
    ),
    header: () => <div className="text-right">Média Dias</div>,
    size: 75,
  },
];

interface UtilitySummaryDataTableProps {
  data: UtilitySummaryRow[];
}

export function UtilitySummaryDataTable({
  data,
}: UtilitySummaryDataTableProps) {
  return <DataTable columns={utilitySummaryColumns} data={data} pageSize={5} />;
}
