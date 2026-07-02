import type {
  AutomationRunStatsRecord,
  ValidateProtocolReturnResultRow,
  ValidateProtocolReturnResultTables,
} from "@topsun/db/schema/postgres";

import { getColetaDadosByUnidadeConsumidora } from "../db/queries";

interface OpenProjectWithProtocol {
  idColeta: number | null;
  nomeCliente: string | null;
  numeroProtocolo: string;
}

interface ManualDivergenceProject extends OpenProjectWithProtocol {
  errorMessage: string;
}

interface NotOkScrapedEntry {
  motivoDivergencia: string;
  unidadeConsumidora: string;
}

interface BuildValidateProtocolReturnResultTablesInput {
  alreadyInsertedProjects?: OpenProjectWithProtocol[];
  closeResults: boolean[];
  manualDivergenceProjects?: ManualDivergenceProject[];
  notOkScrapedEntries: NotOkScrapedEntry[];
  openProjectsWithProtocol: OpenProjectWithProtocol[];
}

function buildAlreadyInsertedRows(
  alreadyInsertedProjects: OpenProjectWithProtocol[]
): ValidateProtocolReturnResultRow[] {
  const rows: ValidateProtocolReturnResultRow[] = [];

  for (const project of alreadyInsertedProjects) {
    if (!project.idColeta) {
      continue;
    }

    rows.push({
      client: project.nomeCliente,
      projectId: project.idColeta,
      protocolNumber: project.numeroProtocolo,
      status: "Já inserido",
    });
  }

  return rows;
}

function buildManualDivergenceRows(
  manualDivergenceProjects: ManualDivergenceProject[]
): ValidateProtocolReturnResultRow[] {
  const rows: ValidateProtocolReturnResultRow[] = [];

  for (const project of manualDivergenceProjects) {
    if (!project.idColeta) {
      continue;
    }

    rows.push({
      client: project.nomeCliente,
      errorMessage: project.errorMessage,
      projectId: project.idColeta,
      protocolNumber: project.numeroProtocolo,
      status: "Manual",
    });
  }

  return rows;
}

function buildDivergenceRows(
  notOkScrapedEntries: NotOkScrapedEntry[]
): Promise<ValidateProtocolReturnResultRow[]> {
  return Promise.all(
    notOkScrapedEntries.map(async (entry) => {
      const matches = await getColetaDadosByUnidadeConsumidora(
        entry.unidadeConsumidora
      );
      const [match] = matches;

      return {
        client: match?.nomeCliente ?? null,
        errorMessage: entry.motivoDivergencia,
        projectId: match?.idColeta ?? 0,
        status: "Divergência",
      } satisfies ValidateProtocolReturnResultRow;
    })
  );
}

function buildClosureRows(
  openProjectsWithProtocol: OpenProjectWithProtocol[],
  closeResults: boolean[]
): ValidateProtocolReturnResultRow[] {
  const rows: ValidateProtocolReturnResultRow[] = [];

  for (const [index, project] of openProjectsWithProtocol.entries()) {
    if (!project.idColeta) {
      continue;
    }

    const succeeded = closeResults[index] === true;

    if (succeeded) {
      rows.push({
        client: project.nomeCliente,
        projectId: project.idColeta,
        protocolNumber: project.numeroProtocolo,
        status: "Sucesso",
      });
      continue;
    }

    rows.push({
      client: project.nomeCliente,
      errorMessage: "Erro ao fechar etapa no TOPSUN.",
      projectId: project.idColeta,
      protocolNumber: project.numeroProtocolo,
      status: "Falha TOPSUN",
    });
  }

  return rows;
}

export async function buildValidateProtocolReturnResultTables(
  input: BuildValidateProtocolReturnResultTablesInput
): Promise<ValidateProtocolReturnResultTables> {
  const [divergenceRows, closureRows] = await Promise.all([
    buildDivergenceRows(input.notOkScrapedEntries),
    Promise.resolve(
      buildClosureRows(input.openProjectsWithProtocol, input.closeResults)
    ),
  ]);

  const manualDivergenceRows = buildManualDivergenceRows(
    input.manualDivergenceProjects ?? []
  );
  const alreadyInsertedRows = buildAlreadyInsertedRows(
    input.alreadyInsertedProjects ?? []
  );

  return {
    rows: [
      ...closureRows,
      ...alreadyInsertedRows,
      ...manualDivergenceRows,
      ...divergenceRows,
    ],
  };
}

export function countValidateProtocolReturnStats(
  resultTables: ValidateProtocolReturnResultTables
): AutomationRunStatsRecord {
  let succeeded = 0;
  let failed = 0;

  for (const row of resultTables.rows) {
    if (row.status === "Sucesso" || row.status === "Já inserido") {
      succeeded += 1;
      continue;
    }

    failed += 1;
  }

  return { failed, succeeded };
}
