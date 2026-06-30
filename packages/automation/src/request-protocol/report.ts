import { mkdir } from "node:fs/promises";
import path from "node:path";

import ExcelJS from "exceljs";

import type { RequestProtocolProject as Project } from "../db/queries";

export type ProtocolStatus = "ERRORED" | "SKIPPED" | "SUCCEEDED";

export interface ProtocolResult {
  errorMessage?: string;
  project: Project;
  status: ProtocolStatus;
}

interface AutomationReportInput {
  celescResults: ProtocolResult[];
  outputPath: string;
  topsunResults: ProtocolResult[];
}

interface SystemReportInput {
  outputPath: string;
  results: ProtocolResult[];
  system: "CELESC" | "TOPSUN";
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

const STATUS_COLORS = {
  ERRO: "FFFFE5E5",
  OK: "FFE2F0D9",
} as const;

const REPORT_COLUMNS = [
  { header: "CELESC", key: "celesc", width: 48 },
  { header: "STATUS", key: "celescStatus", width: 14 },
  { header: "", key: "space1", width: 4 },
  { header: "", key: "space2", width: 4 },
  { header: "", key: "space3", width: 4 },
  { header: "", key: "space4", width: 4 },
  { header: "TOPSUN", key: "topsun", width: 48 },
  { header: "STATUS", key: "topsunStatus", width: 14 },
] as const;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function formatStatus(status: ProtocolStatus) {
  return status === "SUCCEEDED" ? "OK" : "ERRO";
}

function getProjectLabel(project: Project) {
  return `${project.projeto} - ${project.cliente ?? ""}`;
}

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

function paintStatusColumn(worksheet: ExcelJS.Worksheet, columnKey: string) {
  worksheet.getColumn(columnKey).eachCell((cell, rowNumber) => {
    if (rowNumber === 1 || typeof cell.value !== "string") {
      return;
    }

    cell.fill = {
      fgColor: {
        argb: STATUS_COLORS[cell.value as keyof typeof STATUS_COLORS],
      },
      pattern: "solid",
      type: "pattern",
    };
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });
}

function mergeTopsunResults(
  celescResults: ProtocolResult[],
  topsunResults: ProtocolResult[]
) {
  const topsunResultByProjectId = new Map(
    topsunResults.map((result) => [result.project.projeto, result])
  );

  return celescResults.map((celescResult) => {
    const topsunResult = topsunResultByProjectId.get(
      celescResult.project.projeto
    );

    if (topsunResult) {
      return topsunResult;
    }

    return {
      errorMessage: "Não enviado ao TOPSUN porque falhou na CELESC.",
      project: celescResult.project,
      status: "SKIPPED",
    } satisfies ProtocolResult;
  });
}

function addProtocolWorksheet(
  workbook: ExcelJS.Workbook,
  celescResults: ProtocolResult[],
  topsunResults: ProtocolResult[]
) {
  const worksheet = workbook.addWorksheet("Protocolos");
  const topsunResultByProjectId = new Map(
    topsunResults.map((result) => [result.project.projeto, result])
  );

  worksheet.columns = [...REPORT_COLUMNS];

  for (const celescResult of celescResults) {
    const topsunResult = topsunResultByProjectId.get(
      celescResult.project.projeto
    );
    const topsunProject = topsunResult?.project ?? celescResult.project;
    const topsunStatus = topsunResult?.status ?? "SKIPPED";

    worksheet.addRow({
      celesc: getProjectLabel(celescResult.project),
      celescStatus: formatStatus(celescResult.status),
      topsun: getProjectLabel(topsunProject),
      topsunStatus: formatStatus(topsunStatus),
    });
  }

  applyWorksheetUx(worksheet);
  paintStatusColumn(worksheet, "celescStatus");
  paintStatusColumn(worksheet, "topsunStatus");
}

function addSystemWorksheet(
  workbook: ExcelJS.Workbook,
  system: SystemReportInput["system"],
  results: ProtocolResult[]
) {
  const worksheet = workbook.addWorksheet(system);

  worksheet.columns = [
    { header: system, key: "project", width: 48 },
    { header: "STATUS", key: "status", width: 14 },
  ];

  for (const result of results) {
    worksheet.addRow({
      project: getProjectLabel(result.project),
      status: formatStatus(result.status),
    });
  }

  applyWorksheetUx(worksheet);
  paintStatusColumn(worksheet, "status");
}

export function createErroredProtocolResult(
  project: Project,
  error: unknown
): ProtocolResult {
  return {
    errorMessage: getErrorMessage(error),
    project,
    status: "ERRORED",
  };
}

export function createSucceededProtocolResult(
  project: Project
): ProtocolResult {
  return {
    project,
    status: "SUCCEEDED",
  };
}

export async function createProtocolReport({
  celescResults,
  outputPath,
  topsunResults,
}: AutomationReportInput) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "robo-topsun";
  workbook.created = new Date();
  workbook.modified = new Date();

  addProtocolWorksheet(
    workbook,
    celescResults,
    mergeTopsunResults(celescResults, topsunResults)
  );

  await ensureOutputDirectory(outputPath);
  await workbook.xlsx.writeFile(outputPath);
}

export async function createSystemProtocolReport({
  outputPath,
  results,
  system,
}: SystemReportInput) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "robo-topsun";
  workbook.created = new Date();
  workbook.modified = new Date();

  addSystemWorksheet(workbook, system, results);

  await ensureOutputDirectory(outputPath);
  await workbook.xlsx.writeFile(outputPath);
}
