"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { formatAverageDays } from "@/features/installation-completion/utils/installer-summary";
import type { InstallerSummaryRow } from "@/features/installation-completion/utils/installer-summary";
import { DataTable } from "@/shared/components/data-table";
import { formatValue } from "@/shared/utils/format-value";

const numericCellClassName = "block text-right tabular-nums";

const installerSummaryColumns: ColumnDef<InstallerSummaryRow>[] = [
  {
    accessorKey: "instalador",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      return <span className="font-medium">{formatValue(value)}</span>;
    },
    header: "Instalador",
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

interface InstallerSummaryTableProps {
  data: InstallerSummaryRow[];
}

export function InstallerSummaryTable({ data }: InstallerSummaryTableProps) {
  return (
    <DataTable columns={installerSummaryColumns} data={data} pageSize={5} />
  );
}
