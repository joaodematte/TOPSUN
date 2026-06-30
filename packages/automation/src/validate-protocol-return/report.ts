import { mkdir } from "node:fs/promises";
import path from "node:path";

import ExcelJS from "exceljs";

export interface ProtocolReturnEntry {
  dataEmail: string;
  nomeCliente: string;
  numeroProtocolo: string;
}

export interface ProtocolReturnDivergenceEntry {
  cliente: string;
  dataEmail: string;
  motivoDivergencia: string;
  projeto: number | string;
  uc: string;
}

interface ProtocolReturnReportInput {
  entries: ProtocolReturnEntry[];
  outputPath: string;
}

interface ProtocolReturnDivergenceReportInput {
  entries: ProtocolReturnDivergenceEntry[];
  outputPath: string;
}

const HEADER_FILL = {
  fgColor: { argb: "FF1F4E78" },
  pattern: "solid",
  type: "pattern",
} as const;

const HEADER_FONT = {
  bold: true,
  color: { argb: "FFFFFFFF" },
} as const;

const REPORT_COLUMNS = [
  { header: "DATA DO E-MAIL", key: "dataEmail", width: 18 },
  { header: "NOME DO CLIENTE", key: "nomeCliente", width: 48 },
  { header: "NÚMERO PROTOCOLO", key: "numeroProtocolo", width: 24 },
] as const;

const DIVERGENCE_REPORT_COLUMNS = [
  { header: "DATA DO E-MAIL", key: "dataEmail", width: 18 },
  { header: "PROJETO", key: "projeto", width: 14 },
  { header: "CLIENTE", key: "cliente", width: 48 },
  { header: "UC", key: "uc", width: 24 },
  { header: "MOTIVO DIVERGÊNCIA", key: "motivoDivergencia", width: 80 },
] as const;

async function ensureOutputDirectory(outputPath: string) {
  await mkdir(path.dirname(outputPath), { recursive: true });
}

function applyWorksheetUx(worksheet: ExcelJS.Worksheet) {
  worksheet.views = [{ state: "frozen", ySplit: 1 }];
  worksheet.autoFilter = {
    from: { column: 1, row: 1 },
    to: { column: worksheet.columnCount, row: 1 },
  };

  const headerRow = worksheet.getRow(1);
  headerRow.height = 24;
  headerRow.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", wrapText: true };
      cell.border = {
        bottom: { color: { argb: "FFD9EAF7" }, style: "thin" },
        left: { color: { argb: "FFD9EAF7" }, style: "thin" },
        right: { color: { argb: "FFD9EAF7" }, style: "thin" },
        top: { color: { argb: "FFD9EAF7" }, style: "thin" },
      };
    });

    if (rowNumber > 1 && rowNumber % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          fgColor: { argb: "FFF7FBFF" },
          pattern: "solid",
          type: "pattern",
        };
      });
    }
  });
}

export async function createProtocolReturnReport({
  entries,
  outputPath,
}: ProtocolReturnReportInput) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "robo-topsun";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Retorno de Protocolo");
  worksheet.columns = [...REPORT_COLUMNS];

  for (const entry of entries) {
    worksheet.addRow(entry);
  }

  applyWorksheetUx(worksheet);

  await ensureOutputDirectory(outputPath);
  await workbook.xlsx.writeFile(outputPath);
}

export async function createProtocolReturnDivergenceReport({
  entries,
  outputPath,
}: ProtocolReturnDivergenceReportInput) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "robo-topsun";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Divergências");
  worksheet.columns = [...DIVERGENCE_REPORT_COLUMNS];

  for (const entry of entries) {
    worksheet.addRow(entry);
  }

  applyWorksheetUx(worksheet);

  await ensureOutputDirectory(outputPath);
  await workbook.xlsx.writeFile(outputPath);
}
