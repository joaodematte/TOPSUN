import type { RouterOutputs } from "@topsun/api/routers/index";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

export type ProjectStatusCategory =
  | "noPrazo"
  | "atencao"
  | "caminhoCritico"
  | "atrasado";

export const PROJECT_STATUS_CLASSNAME: Record<ProjectStatusCategory, string> = {
  atencao: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  atrasado: "bg-red-500/10 text-red-600 dark:text-red-400",
  caminhoCritico: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  noPrazo: "bg-green-500/10 text-green-600 dark:text-green-400",
};

export interface RequestProtocolStatusThresholds {
  attention: number;
  critical: number;
  onTime: number;
}

export interface ProjectStatusStats {
  atrasado: number;
  atencao: number;
  caminhoCritico: number;
  noPrazo: number;
  total: number;
}

interface ProjectStatusStatsWithPercentage extends ProjectStatusStats {
  atrasadoPercentage: number;
  atencaoPercentage: number;
  caminhoCriticoPercentage: number;
  noPrazoPercentage: number;
}

function toPercentage(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((count / total) * 100);
}

export function classifyProjectStatus(
  diasEtapa: number,
  thresholds: RequestProtocolStatusThresholds
): ProjectStatusCategory | null {
  const { attention, critical, onTime } = thresholds;

  if (diasEtapa >= 0 && diasEtapa <= onTime) {
    return "noPrazo";
  }

  if (diasEtapa > onTime && diasEtapa <= attention) {
    return "atencao";
  }

  if (diasEtapa > attention && diasEtapa <= critical) {
    return "caminhoCritico";
  }

  if (diasEtapa > critical) {
    return "atrasado";
  }

  return null;
}

export function getProjectStatusClassName(
  diasEtapa: number,
  thresholds: RequestProtocolStatusThresholds
): string | undefined {
  const status = classifyProjectStatus(diasEtapa, thresholds);

  if (!status) {
    return undefined;
  }

  return PROJECT_STATUS_CLASSNAME[status];
}

export function getProjectStatusStats(
  projects: ProjectOnRequestProtocol[],
  thresholds: RequestProtocolStatusThresholds
): ProjectStatusStatsWithPercentage {
  const stats: ProjectStatusStats = {
    atencao: 0,
    atrasado: 0,
    caminhoCritico: 0,
    noPrazo: 0,
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
    atencaoPercentage: toPercentage(stats.atencao, stats.total),
    atrasadoPercentage: toPercentage(stats.atrasado, stats.total),
    caminhoCriticoPercentage: toPercentage(stats.caminhoCritico, stats.total),
    noPrazoPercentage: toPercentage(stats.noPrazo, stats.total),
  };
}
