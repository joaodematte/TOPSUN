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

type ProjectOnAccessRequest = RouterOutputs["accessRequest"]["getProjects"];

type ProjectOnArtAccessRequirement =
  RouterOutputs["artAccessRequirement"]["getProjects"];

type ProjectOnUtilityInspectionRequest =
  RouterOutputs["utilityInspectionRequest"]["getProjects"];

type ProjectOnInstallationCompletion =
  RouterOutputs["installationCompletion"]["getProjects"];

type ProjectOnCompletionValidation =
  RouterOutputs["completionValidation"]["getProjects"];

type ProjectOnTechnicalInspectionValidation =
  RouterOutputs["technicalInspectionValidation"]["getProjects"];

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

  const accessRequestProjectsQuery = useQuery({
    ...trpc.accessRequest.getProjects.queryOptions(),
    enabled: source === "accessRequest",
  });

  const artAccessRequirementProjectsQuery = useQuery({
    ...trpc.artAccessRequirement.getProjects.queryOptions(),
    enabled: source === "artAccessRequirement",
  });

  const utilityInspectionRequestProjectsQuery = useQuery({
    ...trpc.utilityInspectionRequest.getProjects.queryOptions(),
    enabled: source === "utilityInspectionRequest",
  });

  const installationCompletionProjectsQuery = useQuery({
    ...trpc.installationCompletion.getProjects.queryOptions(),
    enabled: source === "installationCompletion",
  });

  const completionValidationProjectsQuery = useQuery({
    ...trpc.completionValidation.getProjects.queryOptions(),
    enabled: source === "completionValidation",
  });

  const technicalInspectionValidationProjectsQuery = useQuery({
    ...trpc.technicalInspectionValidation.getProjects.queryOptions(),
    enabled: source === "technicalInspectionValidation",
  });

  const requestProtocolThresholdsQuery = useQuery({
    ...trpc.requestProtocol.getStatusThresholds.queryOptions(),
    enabled: source === "requestProtocol",
  });

  const inspectionApprovalThresholdsQuery = useQuery({
    ...trpc.inspectionApproval.getStatusThresholds.queryOptions(),
    enabled: source === "inspectionApproval",
  });

  const accessRequestThresholdsQuery = useQuery({
    ...trpc.accessRequest.getStatusThresholds.queryOptions(),
    enabled: source === "accessRequest",
  });

  const artAccessRequirementThresholdsQuery = useQuery({
    ...trpc.artAccessRequirement.getStatusThresholds.queryOptions(),
    enabled: source === "artAccessRequirement",
  });

  const utilityInspectionRequestThresholdsQuery = useQuery({
    ...trpc.utilityInspectionRequest.getStatusThresholds.queryOptions(),
    enabled: source === "utilityInspectionRequest",
  });

  const installationCompletionThresholdsQuery = useQuery({
    ...trpc.installationCompletion.getStatusThresholds.queryOptions(),
    enabled: source === "installationCompletion",
  });

  const completionValidationThresholdsQuery = useQuery({
    ...trpc.completionValidation.getStatusThresholds.queryOptions(),
    enabled: source === "completionValidation",
  });

  const technicalInspectionValidationThresholdsQuery = useQuery({
    ...trpc.technicalInspectionValidation.getStatusThresholds.queryOptions(),
    enabled: source === "technicalInspectionValidation",
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

  if (source === "accessRequest") {
    return {
      isLoading:
        accessRequestProjectsQuery.isLoading ||
        accessRequestThresholdsQuery.isLoading,
      projects: accessRequestProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: accessRequestThresholdsQuery.data,
    };
  }

  if (source === "artAccessRequirement") {
    return {
      isLoading:
        artAccessRequirementProjectsQuery.isLoading ||
        artAccessRequirementThresholdsQuery.isLoading,
      projects: artAccessRequirementProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: artAccessRequirementThresholdsQuery.data,
    };
  }

  if (source === "utilityInspectionRequest") {
    return {
      isLoading:
        utilityInspectionRequestProjectsQuery.isLoading ||
        utilityInspectionRequestThresholdsQuery.isLoading,
      projects: utilityInspectionRequestProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: utilityInspectionRequestThresholdsQuery.data,
    };
  }

  if (source === "installationCompletion") {
    return {
      isLoading:
        installationCompletionProjectsQuery.isLoading ||
        installationCompletionThresholdsQuery.isLoading,
      projects: installationCompletionProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: installationCompletionThresholdsQuery.data,
    };
  }

  if (source === "completionValidation") {
    return {
      isLoading:
        completionValidationProjectsQuery.isLoading ||
        completionValidationThresholdsQuery.isLoading,
      projects: completionValidationProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: completionValidationThresholdsQuery.data,
    };
  }

  if (source === "technicalInspectionValidation") {
    return {
      isLoading:
        technicalInspectionValidationProjectsQuery.isLoading ||
        technicalInspectionValidationThresholdsQuery.isLoading,
      projects: technicalInspectionValidationProjectsQuery.data as
        | DashboardProject[]
        | undefined,
      thresholds: technicalInspectionValidationThresholdsQuery.data,
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

export type {
  ProjectOnAccessRequest,
  ProjectOnArtAccessRequirement,
  ProjectOnInspectionApproval,
  ProjectOnInstallationCompletion,
  ProjectOnCompletionValidation,
  ProjectOnRequestProtocol,
  ProjectOnTechnicalInspectionValidation,
  ProjectOnUtilityInspectionRequest,
};
