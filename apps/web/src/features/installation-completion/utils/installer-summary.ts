import { classifyProjectStatus } from "@/features/dashboard/utils/project-status";
import type {
  ProjectStatusThresholds,
  ProjectWithDiasEtapa,
} from "@/features/dashboard/utils/project-status";
import { formatAverageDays } from "@/features/dashboard/utils/utility-summary";

export interface InstallerSummaryRow {
  attention: number;
  critical: number;
  instalador: string;
  mediaDias: number;
  onTime: number;
  overdue: number;
  total: number;
}

interface InstallerAccumulator {
  attention: number;
  critical: number;
  diasSum: number;
  onTime: number;
  overdue: number;
  total: number;
}

function createEmptyAccumulator(): InstallerAccumulator {
  return {
    attention: 0,
    critical: 0,
    diasSum: 0,
    onTime: 0,
    overdue: 0,
    total: 0,
  };
}

function getInstallerLabel(
  project: ProjectWithDiasEtapa & {
    instalador: number | null;
    instaladorNome: string | null;
  }
): string | null {
  const nome = project.instaladorNome?.trim();

  if (nome) {
    return nome;
  }

  if (project.instalador !== null) {
    return String(project.instalador);
  }

  return null;
}

export function getInstallerSummaryByInstalador<
  T extends ProjectWithDiasEtapa & {
    instalador: number | null;
    instaladorNome: string | null;
  },
>(projects: T[], thresholds: ProjectStatusThresholds): InstallerSummaryRow[] {
  const byInstalador = new Map<string, InstallerAccumulator>();

  for (const project of projects) {
    const instalador = getInstallerLabel(project);

    if (!instalador) {
      continue;
    }

    const accumulator =
      byInstalador.get(instalador) ?? createEmptyAccumulator();

    accumulator.total += 1;
    accumulator.diasSum += project.diasEtapa;

    const status = classifyProjectStatus(project.diasEtapa, thresholds);

    if (status) {
      accumulator[status] += 1;
    }

    byInstalador.set(instalador, accumulator);
  }

  return [...byInstalador.entries()]
    .map(([instalador, accumulator]) => ({
      attention: accumulator.attention,
      critical: accumulator.critical,
      instalador,
      mediaDias:
        accumulator.total === 0 ? 0 : accumulator.diasSum / accumulator.total,
      onTime: accumulator.onTime,
      overdue: accumulator.overdue,
      total: accumulator.total,
    }))
    .toSorted((a, b) => {
      if (b.total !== a.total) {
        return b.total - a.total;
      }

      return a.instalador.localeCompare(b.instalador, "pt-BR");
    });
}

export { formatAverageDays };
