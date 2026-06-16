import { classifyProjectStatus } from "@/features/dashboard/utils/project-status";
import type {
  ProjectStatusThresholds,
  ProjectWithDiasEtapa,
} from "@/features/dashboard/utils/project-status";
import { isProjectSolicitado } from "@/features/dashboard/utils/solicitado";

export interface CitySummaryRow {
  attention: number;
  critical: number;
  cidade: string;
  mediaDias: number;
  onTime: number;
  overdue: number;
  solicitado: number;
  total: number;
}

interface CityAccumulator {
  attention: number;
  critical: number;
  diasSum: number;
  onTime: number;
  overdue: number;
  solicitado: number;
  total: number;
}

function createEmptyAccumulator(): CityAccumulator {
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

function getCityLabel(
  project: ProjectWithDiasEtapa & {
    cidadeInstalacao: string | null;
    estadoInstalacao?: string | null;
  }
): string | null {
  const cidade = project.cidadeInstalacao?.trim();

  if (!cidade) {
    return null;
  }

  const estado = project.estadoInstalacao?.trim();

  if (estado && !cidade.endsWith(`-${estado}`)) {
    return `${cidade}-${estado}`;
  }

  return cidade;
}

export function getCitySummaryByOccurrence<
  T extends ProjectWithDiasEtapa & {
    cidadeInstalacao: string | null;
    dataSolicitado?: string | null;
    estadoInstalacao?: string | null;
  },
>(
  projects: T[],
  thresholds: ProjectStatusThresholds,
  options?: { includeSolicitado?: boolean }
): CitySummaryRow[] {
  const byCity = new Map<string, CityAccumulator>();

  for (const project of projects) {
    const cidade = getCityLabel(project);

    if (!cidade) {
      continue;
    }

    const accumulator = byCity.get(cidade) ?? createEmptyAccumulator();

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

    byCity.set(cidade, accumulator);
  }

  return [...byCity.entries()]
    .map(([cidade, accumulator]) => ({
      attention: accumulator.attention,
      cidade,
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

      return a.cidade.localeCompare(b.cidade, "pt-BR");
    });
}
