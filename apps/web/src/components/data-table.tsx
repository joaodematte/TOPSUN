"use client";

import type { Cell, ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@topsun/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@topsun/ui/components/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@topsun/ui/components/tooltip";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

interface CustomTableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>;
}

function getColumnSizeStyle(size: number): CSSProperties {
  return {
    maxWidth: size,
    minWidth: size,
    width: size,
  };
}

function CustomTableCell<TData, TValue>({
  cell,
}: CustomTableCellProps<TData, TValue>) {
  const contentRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const value = String(cell.getValue() ?? "");
  const content = flexRender(cell.column.columnDef.cell, cell.getContext());

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const checkTruncation = () => {
      setIsTruncated(element.scrollWidth > element.clientWidth + 1);
    };

    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  return (
    <TableCell
      className="max-w-0"
      style={getColumnSizeStyle(cell.column.getSize())}
    >
      <Tooltip
        disabled={!isTruncated || value.length === 0}
        disableHoverablePopup
      >
        <TooltipTrigger
          render={
            <span ref={contentRef} className="block w-full truncate">
              {content}
            </span>
          }
        />
        <TooltipContent side="top">
          <p className="wrap-break-word">{value}</p>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 15,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <TooltipProvider delay={0}>
      <div>
        <div className="overflow-hidden rounded-[min(var(--radius-4xl),24px)] border">
          <Table>
            <colgroup>
              {table.getAllLeafColumns().map((column) => (
                <col
                  key={column.id}
                  style={getColumnSizeStyle(column.getSize())}
                />
              ))}
            </colgroup>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="max-w-0 truncate"
                      style={getColumnSizeStyle(header.getSize())}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <CustomTableCell key={cell.id} cell={cell} />
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Nenhum resultado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {table.getPageCount() > 1 ? (
          <div className="flex items-center justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próximo
            </Button>
          </div>
        ) : null}
      </div>
    </TooltipProvider>
  );
}
