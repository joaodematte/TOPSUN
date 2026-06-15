"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { CitySummaryRow } from "@/features/dashboard/utils/city-summary";
import { formatAverageDays } from "@/features/dashboard/utils/utility-summary";
import { DataTable } from "@/shared/components/data-table";
import { formatValue } from "@/shared/utils/format-value";

const REQUESTED_MOCK = "—";

const numericCellClassName = "block text-right tabular-nums";

const citySummaryColumns: ColumnDef<CitySummaryRow>[] = [
  {
    accessorKey: "cidade",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{formatValue(value)}</span>;
    },
    header: "Cidade",
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
    header: () => <div className="text-right">Média dias</div>,
    size: 75,
  },
];

interface CitySummaryTableProps {
  data: CitySummaryRow[];
}

export function CitySummaryTable({ data }: CitySummaryTableProps) {
  return <DataTable columns={citySummaryColumns} data={data} pageSize={5} />;
}
