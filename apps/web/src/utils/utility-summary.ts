import type { RouterOutputs } from "@topsun/api/routers/index";

import { classifyProjectStatus } from "@/utils/project-status";
import type { RequestProtocolStatusThresholds } from "@/utils/project-status";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

export interface UtilitySummaryRow {
  atrasado: number;
  atencao: number;
  caminhoCritico: number;
  concessionaria: string;
  mediaDias: number;
  noPrazo: number;
  total: number;
}

interface UtilityAccumulator {
  atrasado: number;
  atencao: number;
  caminhoCritico: number;
  diasSum: number;
  noPrazo: number;
  total: number;
}

const averageDaysFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

export function formatAverageDays(value: number): string {
  return averageDaysFormatter.format(value);
}

function createEmptyAccumulator(): UtilityAccumulator {
  return {
    atencao: 0,
    atrasado: 0,
    caminhoCritico: 0,
    diasSum: 0,
    noPrazo: 0,
    total: 0,
  };
}

export function getUtilitySummaryByConcessionaria(
  projects: ProjectOnRequestProtocol[],
  thresholds: RequestProtocolStatusThresholds
): UtilitySummaryRow[] {
  const byConcessionaria = new Map<string, UtilityAccumulator>();

  for (const project of projects) {
    const concessionaria = project.concessionaria?.trim();

    if (!concessionaria) {
      continue;
    }

    const accumulator =
      byConcessionaria.get(concessionaria) ?? createEmptyAccumulator();

    accumulator.total += 1;
    accumulator.diasSum += project.diasEtapa;

    const status = classifyProjectStatus(project.diasEtapa, thresholds);

    if (status) {
      accumulator[status] += 1;
    }

    byConcessionaria.set(concessionaria, accumulator);
  }

  return [...byConcessionaria.entries()]
    .map(([concessionaria, accumulator]) => ({
      atencao: accumulator.atencao,
      atrasado: accumulator.atrasado,
      caminhoCritico: accumulator.caminhoCritico,
      concessionaria,
      mediaDias:
        accumulator.total === 0 ? 0 : accumulator.diasSum / accumulator.total,
      noPrazo: accumulator.noPrazo,
      total: accumulator.total,
    }))
    .toSorted((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      return a.concessionaria.localeCompare(b.concessionaria, "pt-BR");
    });
}
