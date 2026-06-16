import { isProjectSolicitado } from "@/features/dashboard/utils/solicitado";

export type ProjectStatusCategory =
  | "onTime"
  | "attention"
  | "critical"
  | "overdue";

export type ProjectStatusFilter =
  | ProjectStatusCategory
  | "total"
  | "solicitado";

export const PROJECT_STATUS_FILTER_LABEL: Record<ProjectStatusFilter, string> =
  {
    attention: "Atenção",
    critical: "Caminho crítico",
    onTime: "No prazo",
    overdue: "Atrasados",
    solicitado: "Solicitados",
    total: "Total",
  };

export const PROJECT_STATUS_CLASSNAME: Record<ProjectStatusCategory, string> = {
  attention: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  critical: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  onTime: "bg-green-500/10 text-green-600 dark:text-green-400",
  overdue: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export interface ProjectWithDiasEtapa {
  diasEtapa: number;
}

export type DashboardProject = ProjectWithDiasEtapa & {
  cidadeInstalacao: string | null;
  concessionaria: string | null;
  dataSolicitado?: string | null;
  estadoInstalacao?: string | null;
};

export interface ProjectStatusThresholds {
  attention: number;
  critical: number;
  onTime: number;
}
export interface ProjectStatusStats {
  attention: number;
  critical: number;
  onTime: number;
  overdue: number;
  total: number;
}

interface ProjectStatusStatsWithPercentage extends ProjectStatusStats {
  attentionPercentage: number;
  criticalPercentage: number;
  onTimePercentage: number;
  overduePercentage: number;
}

function toPercentage(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

export function classifyProjectStatus(
  diasEtapa: number,
  thresholds: ProjectStatusThresholds
): ProjectStatusCategory | null {
  const { attention, critical, onTime } = thresholds;

  if (diasEtapa >= 0 && diasEtapa <= onTime) {
    return "onTime";
  }

  if (diasEtapa > onTime && diasEtapa <= attention) {
    return "attention";
  }

  if (diasEtapa > attention && diasEtapa <= critical) {
    return "critical";
  }

  if (diasEtapa > critical) {
    return "overdue";
  }

  return null;
}

export function getProjectStatusClassName(
  diasEtapa: number,
  thresholds: ProjectStatusThresholds
): string | undefined {
  const status = classifyProjectStatus(diasEtapa, thresholds);

  if (!status) {
    return undefined;
  }

  return PROJECT_STATUS_CLASSNAME[status];
}

export function filterProjectsByStatus<T extends ProjectWithDiasEtapa>(
  projects: T[],
  thresholds: ProjectStatusThresholds,
  status: ProjectStatusFilter
): T[] {
  if (status === "total") {
    return projects;
  }

  if (status === "solicitado") {
    return projects.filter((project) =>
      isProjectSolicitado(
        (project as T & { dataSolicitado?: string | null }).dataSolicitado
      )
    );
  }

  return projects.filter(
    (project) => classifyProjectStatus(project.diasEtapa, thresholds) === status
  );
}

export function getProjectStatusStats<T extends ProjectWithDiasEtapa>(
  projects: T[],
  thresholds: ProjectStatusThresholds
): ProjectStatusStatsWithPercentage {
  const stats: ProjectStatusStats = {
    attention: 0,
    critical: 0,
    onTime: 0,
    overdue: 0,
    total: projects.length,
  };

  for (const project of projects) {
    const status = classifyProjectStatus(project.diasEtapa, thresholds);

    if (status) {
      stats[status] += 1;
    }
  }

  return {
    ...stats,
    attentionPercentage: toPercentage(stats.attention, stats.total),
    criticalPercentage: toPercentage(stats.critical, stats.total),
    onTimePercentage: toPercentage(stats.onTime, stats.total),
    overduePercentage: toPercentage(stats.overdue, stats.total),
  };
}
