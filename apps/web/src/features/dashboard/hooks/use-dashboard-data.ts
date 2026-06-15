import { useQuery } from "@tanstack/react-query";
import type { RouterOutputs } from "@topsun/api";

import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import type {
  DashboardProject,
  ProjectStatusThresholds,
} from "@/features/dashboard/utils/project-status";
import { useTRPC } from "@/features/platform/api/trpc";

type ProjectOnRequestProtocol = RouterOutputs["requestProtocol"]["getProjects"];

type ProjectOnInspectionApproval =
  RouterOutputs["inspectionApproval"]["getProjects"];

interface DashboardDataResult {
  isLoading: boolean;
  projects: DashboardProject[] | undefined;
  thresholds: ProjectStatusThresholds | undefined;
}

export function useDashboardData(source: DashboardSource): DashboardDataResult {
  const trpc = useTRPC();

  const requestProtocolProjectsQuery = useQuery({
    ...trpc.requestProtocol.getProjects.queryOptions(),
    enabled: source === "requestProtocol",
  });

  const inspectionApprovalProjectsQuery = useQuery({
    ...trpc.inspectionApproval.getProjects.queryOptions(),
    enabled: source === "inspectionApproval",
  });

  const requestProtocolThresholdsQuery = useQuery({
    ...trpc.requestProtocol.getStatusThresholds.queryOptions(),
    enabled: source === "requestProtocol",
  });

  const inspectionApprovalThresholdsQuery = useQuery({
    ...trpc.inspectionApproval.getStatusThresholds.queryOptions(),
    enabled: source === "inspectionApproval",
  });

  if (source === "inspectionApproval") {
    return {
      isLoading:
        inspectionApprovalProjectsQuery.isLoading ||
        inspectionApprovalThresholdsQuery.isLoading,
      projects: inspectionApprovalProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: inspectionApprovalThresholdsQuery.data,
    };
  }

  return {
    isLoading:
      requestProtocolProjectsQuery.isLoading ||
      requestProtocolThresholdsQuery.isLoading,
    projects: requestProtocolProjectsQuery.data as
      | DashboardProject[]
      | undefined,
    thresholds: requestProtocolThresholdsQuery.data,
  };
}

export type { ProjectOnInspectionApproval, ProjectOnRequestProtocol };
