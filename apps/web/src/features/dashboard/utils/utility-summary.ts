import { classifyProjectStatus } from "@/features/dashboard/utils/project-status";
import type {
  ProjectStatusThresholds,
  ProjectWithDiasEtapa,
} from "@/features/dashboard/utils/project-status";
import { isProjectSolicitado } from "@/features/dashboard/utils/solicitado";

export interface UtilitySummaryRow {
  attention: number;
  concessionaria: string;
  critical: number;
  mediaDias: number;
  onTime: number;
  overdue: number;
  solicitado: number;
  total: number;
}

interface UtilityAccumulator {
  attention: number;
  critical: number;
  diasSum: number;
  onTime: number;
  overdue: number;
  solicitado: number;
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
    attention: 0,
    critical: 0,
    diasSum: 0,
    onTime: 0,
    overdue: 0,
    solicitado: 0,
    total: 0,
  };
}

export function getUtilitySummaryByConcessionaria<
  T extends ProjectWithDiasEtapa & {
    concessionaria: string | null;
    dataSolicitado?: string | null;
  },
>(
  projects: T[],
  thresholds: ProjectStatusThresholds,
  options?: { includeSolicitado?: boolean }
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

    if (
      options?.includeSolicitado &&
      isProjectSolicitado(project.dataSolicitado)
    ) {
      accumulator.solicitado += 1;
    }

    byConcessionaria.set(concessionaria, accumulator);
  }

  return [...byConcessionaria.entries()]
    .map(([concessionaria, accumulator]) => ({
      attention: accumulator.attention,
      concessionaria,
      critical: accumulator.critical,
      mediaDias:
        accumulator.total === 0 ? 0 : accumulator.diasSum / accumulator.total,
      onTime: accumulator.onTime,
      overdue: accumulator.overdue,
      solicitado: accumulator.solicitado,
      total: accumulator.total,
    }))
    .toSorted((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      return a.concessionaria.localeCompare(b.concessionaria, "pt-BR");
    });
}
