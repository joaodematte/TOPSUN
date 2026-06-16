import { classifyProjectStatus } from "@/features/dashboard/utils/project-status";
import type {
  ProjectStatusThresholds,
  ProjectWithDiasEtapa,
} from "@/features/dashboard/utils/project-status";
import { formatAverageDays } from "@/features/dashboard/utils/utility-summary";

export interface RepresentativeSummaryRow {
  attention: number;
  critical: number;
  mediaDias: number;
  onTime: number;
  overdue: number;
  representante: string;
  total: number;
}

interface RepresentativeAccumulator {
  attention: number;
  critical: number;
  diasSum: number;
  onTime: number;
  overdue: number;
  total: number;
}

function createEmptyAccumulator(): RepresentativeAccumulator {
  return {
    attention: 0,
    critical: 0,
    diasSum: 0,
    onTime: 0,
    overdue: 0,
    total: 0,
  };
}

export function getRepresentativeSummaryByRepresentante<
  T extends ProjectWithDiasEtapa & { representante: string | null },
>(
  projects: T[],
  thresholds: ProjectStatusThresholds
): RepresentativeSummaryRow[] {
  const byRepresentante = new Map<string, RepresentativeAccumulator>();

  for (const project of projects) {
    const representante = project.representante?.trim();

    if (!representante) {
      continue;
    }

    const accumulator =
      byRepresentante.get(representante) ?? createEmptyAccumulator();

    accumulator.total += 1;
    accumulator.diasSum += project.diasEtapa;

    const status = classifyProjectStatus(project.diasEtapa, thresholds);

    if (status) {
      accumulator[status] += 1;
    }

    byRepresentante.set(representante, accumulator);
  }

  return [...byRepresentante.entries()]
    .map(([representante, accumulator]) => ({
      attention: accumulator.attention,
      critical: accumulator.critical,
      mediaDias:
        accumulator.total === 0 ? 0 : accumulator.diasSum / accumulator.total,
      onTime: accumulator.onTime,
      overdue: accumulator.overdue,
      representante,
      total: accumulator.total,
    }))
    .toSorted((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      return a.representante.localeCompare(b.representante, "pt-BR");
    });
}

export { formatAverageDays };
