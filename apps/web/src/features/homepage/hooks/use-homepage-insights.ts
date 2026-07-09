import { useQueries } from "@tanstack/react-query";

import type {
  DashboardProject,
  ProjectStatusStats,
  ProjectStatusThresholds,
} from "@/features/dashboard/utils/project-status";
import { getProjectStatusStats } from "@/features/dashboard/utils/project-status";
import { HOMEPAGE_STAGE_SOURCES } from "@/features/homepage/utils/homepage-sources";
import type { HomepageStageSource } from "@/features/homepage/utils/homepage-sources";
import { useTRPC } from "@/features/platform/api/trpc";

export interface HomepageStageInsight {
  critical: number;
  href: HomepageStageSource["href"];
  isError: boolean;
  isLoading: boolean;
  overdue: number;
  overduePercentage: number;
  shortTitle: string;
  source: HomepageStageSource["source"];
  stats: ProjectStatusStats | null;
  total: number;
}

export interface HomepageGlobalInsight {
  attention: number;
  critical: number;
  onTime: number;
  overdue: number;
  total: number;
}

function getProjectsQueryOptions(
  trpc: ReturnType<typeof useTRPC>,
  source: HomepageStageSource["source"]
) {
  switch (source) {
    case "requestProtocol": {
      return trpc.requestProtocol.getProjects.queryOptions();
    }
    case "inspectionApproval": {
      return trpc.inspectionApproval.getProjects.queryOptions();
    }
    case "accessRequest": {
      return trpc.accessRequest.getProjects.queryOptions();
    }
    case "artAccessRequirement": {
      return trpc.artAccessRequirement.getProjects.queryOptions();
    }
    case "utilityInspectionRequest": {
      return trpc.utilityInspectionRequest.getProjects.queryOptions();
    }
    case "installationCompletion": {
      return trpc.installationCompletion.getProjects.queryOptions();
    }
    case "completionValidation": {
      return trpc.completionValidation.getProjects.queryOptions();
    }
    case "technicalInspectionValidation": {
      return trpc.technicalInspectionValidation.getProjects.queryOptions();
    }
    default: {
      const unhandledSource: never = source;
      throw new Error(`Fonte de dashboard não suportada: ${unhandledSource}`);
    }
  }
}

function getThresholdsQueryOptions(
  trpc: ReturnType<typeof useTRPC>,
  source: HomepageStageSource["source"]
) {
  switch (source) {
    case "requestProtocol": {
      return trpc.requestProtocol.getStatusThresholds.queryOptions();
    }
    case "inspectionApproval": {
      return trpc.inspectionApproval.getStatusThresholds.queryOptions();
    }
    case "accessRequest": {
      return trpc.accessRequest.getStatusThresholds.queryOptions();
    }
    case "artAccessRequirement": {
      return trpc.artAccessRequirement.getStatusThresholds.queryOptions();
    }
    case "utilityInspectionRequest": {
      return trpc.utilityInspectionRequest.getStatusThresholds.queryOptions();
    }
    case "installationCompletion": {
      return trpc.installationCompletion.getStatusThresholds.queryOptions();
    }
    case "completionValidation": {
      return trpc.completionValidation.getStatusThresholds.queryOptions();
    }
    case "technicalInspectionValidation": {
      return trpc.technicalInspectionValidation.getStatusThresholds.queryOptions();
    }
    default: {
      const unhandledSource: never = source;
      throw new Error(`Fonte de dashboard não suportada: ${unhandledSource}`);
    }
  }
}

function buildStageInsight(
  stage: HomepageStageSource,
  projects: DashboardProject[] | undefined,
  thresholds: ProjectStatusThresholds | undefined,
  isLoading: boolean,
  isError: boolean
): HomepageStageInsight {
  if (!projects || !thresholds) {
    return {
      critical: 0,
      href: stage.href,
      isError,
      isLoading,
      overdue: 0,
      overduePercentage: 0,
      shortTitle: stage.shortTitle,
      source: stage.source,
      stats: null,
      total: 0,
    };
  }

  const stats = getProjectStatusStats(projects, thresholds);

  return {
    critical: stats.critical,
    href: stage.href,
    isError,
    isLoading,
    overdue: stats.overdue,
    overduePercentage: stats.overduePercentage,
    shortTitle: stage.shortTitle,
    source: stage.source,
    stats,
    total: stats.total,
  };
}

function aggregateGlobalInsight(
  stages: HomepageStageInsight[]
): HomepageGlobalInsight {
  const globalInsight: HomepageGlobalInsight = {
    attention: 0,
    critical: 0,
    onTime: 0,
    overdue: 0,
    total: 0,
  };

  for (const stage of stages) {
    if (!stage.stats) {
      continue;
    }

    globalInsight.attention += stage.stats.attention;
    globalInsight.critical += stage.stats.critical;
    globalInsight.onTime += stage.stats.onTime;
    globalInsight.overdue += stage.stats.overdue;
    globalInsight.total += stage.stats.total;
  }

  return globalInsight;
}

export function useHomepageInsights() {
  const trpc = useTRPC();

  const projectQueries = useQueries({
    queries: HOMEPAGE_STAGE_SOURCES.map((stage) => ({
      ...getProjectsQueryOptions(trpc, stage.source),
    })),
  });

  const thresholdQueries = useQueries({
    queries: HOMEPAGE_STAGE_SOURCES.map((stage) => ({
      ...getThresholdsQueryOptions(trpc, stage.source),
    })),
  });

  const stages = HOMEPAGE_STAGE_SOURCES.map((stage, index) => {
    const projectsQuery = projectQueries[index];
    const thresholdsQuery = thresholdQueries[index];

    return buildStageInsight(
      stage,
      projectsQuery?.data as DashboardProject[] | undefined,
      thresholdsQuery?.data,
      Boolean(projectsQuery?.isLoading || thresholdsQuery?.isLoading),
      Boolean(projectsQuery?.isError || thresholdsQuery?.isError)
    );
  });

  const isLoading = stages.some((stage) => stage.isLoading);
  const globalInsight = aggregateGlobalInsight(stages);

  return {
    globalInsight,
    isLoading,
    stages,
  };
}
