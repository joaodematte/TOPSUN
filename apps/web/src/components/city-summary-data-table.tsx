"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import type { CitySummaryRow } from "@/utils/city-summary";
import { formatValue } from "@/utils/table";
import { formatAverageDays } from "@/utils/utility-summary";

const SOLICITADOS_MOCK = "—";

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
    accessorKey: "noPrazo",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">No Prazo</div>,
    size: 75,
  },
  {
    accessorKey: "atencao",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Atenção</div>,
    size: 75,
  },
  {
    accessorKey: "caminhoCritico",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Crítico</div>,
    size: 75,
  },
  {
    accessorKey: "atrasado",
    cell: ({ getValue }) => (
      <span className={numericCellClassName}>{getValue<number>()}</span>
    ),
    header: () => <div className="text-right">Atrasado</div>,
    size: 75,
  },
  {
    cell: () => (
      <span className={numericCellClassName}>{SOLICITADOS_MOCK}</span>
    ),
    header: () => <div className="text-right">Pr. Solicitado</div>,
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

interface CitySummaryDataTableProps {
  data: CitySummaryRow[];
}

export function CitySummaryDataTable({ data }: CitySummaryDataTableProps) {
  return <DataTable columns={citySummaryColumns} data={data} pageSize={5} />;
}
