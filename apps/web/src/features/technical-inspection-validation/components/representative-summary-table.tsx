"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatAverageDays } from "@/features/technical-inspection-validation/utils/representative-summary";
import type { RepresentativeSummaryRow } from "@/features/technical-inspection-validation/utils/representative-summary";
import { DataTable } from "@/shared/components/data-table";
import { formatValue } from "@/shared/utils/format-value";

const numericCellClassName = "block text-right tabular-nums";

const representativeSummaryColumns: ColumnDef<RepresentativeSummaryRow>[] = [
  {
    accessorKey: "representante",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{formatValue(value)}</span>;
    },
    header: "Representante",
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

interface RepresentativeSummaryTableProps {
  data: RepresentativeSummaryRow[];
}

export function RepresentativeSummaryTable({
  data,
}: RepresentativeSummaryTableProps) {
  return (
    <DataTable
      columns={representativeSummaryColumns}
      data={data}
      pageSize={5}
    />
  );
}
