"use client";

import type { RouterOutputs } from "@topsun/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@topsun/ui/components/dialog";

import { AccessRequestDataTable } from "@/features/access-request/components/access-request-data-table";
import { ArtAccessRequirementDataTable } from "@/features/art-access-requirement/components/art-access-requirement-data-table";
import { CompletionValidationDataTable } from "@/features/completion-validation/components/completion-validation-data-table";
import { useProjectStatusDialogStore } from "@/features/dashboard/stores/project-status-dialog-store";
import {
  filterProjectsByStatus,
  PROJECT_STATUS_FILTER_LABEL,
} from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { InspectionApprovalDataTable } from "@/features/inspection-approval/components/inspection-approval-data-table";
import { InstallationCompletionDataTable } from "@/features/installation-completion/components/installation-completion-data-table";
import { RequestProtocolDataTable } from "@/features/request-protocol/components/request-protocol-data-table";
import { TechnicalInspectionValidationDataTable } from "@/features/technical-inspection-validation/components/technical-inspection-validation-data-table";
import { UtilityInspectionRequestDataTable } from "@/features/utility-inspection-request/components/utility-inspection-request-data-table";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

type ProjectOnInspectionApproval =
  RouterOutputs["inspectionApproval"]["getProjects"][number];

type ProjectOnAccessRequest =
  RouterOutputs["accessRequest"]["getProjects"][number];

type ProjectOnArtAccessRequirement =
  RouterOutputs["artAccessRequirement"]["getProjects"][number];

type ProjectOnUtilityInspectionRequest =
  RouterOutputs["utilityInspectionRequest"]["getProjects"][number];

type ProjectOnInstallationCompletion =
  RouterOutputs["installationCompletion"]["getProjects"][number];

type ProjectOnCompletionValidation =
  RouterOutputs["completionValidation"]["getProjects"][number];

type ProjectOnTechnicalInspectionValidation =
  RouterOutputs["technicalInspectionValidation"]["getProjects"][number];

interface ProjectStatusProjectsDialogBaseProps {
  thresholds: ProjectStatusThresholds;
}

interface RequestProtocolProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnRequestProtocol[];
  source?: "requestProtocol";
}

interface InspectionApprovalProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnInspectionApproval[];
  source: "inspectionApproval";
}

interface AccessRequestProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnAccessRequest[];
  source: "accessRequest";
}

interface ArtAccessRequirementProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnArtAccessRequirement[];
  source: "artAccessRequirement";
}

interface UtilityInspectionRequestProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnUtilityInspectionRequest[];
  source: "utilityInspectionRequest";
}

interface InstallationCompletionProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnInstallationCompletion[];
  source: "installationCompletion";
}

interface CompletionValidationProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnCompletionValidation[];
  source: "completionValidation";
}

interface TechnicalInspectionValidationProjectStatusProjectsDialogProps extends ProjectStatusProjectsDialogBaseProps {
  projects: ProjectOnTechnicalInspectionValidation[];
  source: "technicalInspectionValidation";
}

type ProjectStatusProjectsDialogProps =
  | RequestProtocolProjectStatusProjectsDialogProps
  | InspectionApprovalProjectStatusProjectsDialogProps
  | AccessRequestProjectStatusProjectsDialogProps
  | ArtAccessRequirementProjectStatusProjectsDialogProps
  | UtilityInspectionRequestProjectStatusProjectsDialogProps
  | InstallationCompletionProjectStatusProjectsDialogProps
  | CompletionValidationProjectStatusProjectsDialogProps
  | TechnicalInspectionValidationProjectStatusProjectsDialogProps;

function ProjectStatusProjectsDialogContent({
  children,
  filteredProjects,
}: {
  children: React.ReactNode;
  filteredProjects: unknown[];
}) {
  const { closeDialog, open, selectedStatus } = useProjectStatusDialogStore();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      closeDialog();
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-6xl flex-col gap-4 overflow-hidden sm:max-w-6xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {selectedStatus
              ? PROJECT_STATUS_FILTER_LABEL[selectedStatus]
              : "Projetos"}
          </DialogTitle>
          <DialogDescription>
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "projeto" : "projetos"}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

function RequestProtocolProjectStatusProjectsDialog({
  projects,
  thresholds,
}: RequestProtocolProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <RequestProtocolDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function InspectionApprovalProjectStatusProjectsDialog({
  projects,
  thresholds,
}: InspectionApprovalProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <InspectionApprovalDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function AccessRequestProjectStatusProjectsDialog({
  projects,
  thresholds,
}: AccessRequestProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <AccessRequestDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function ArtAccessRequirementProjectStatusProjectsDialog({
  projects,
  thresholds,
}: ArtAccessRequirementProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <ArtAccessRequirementDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function UtilityInspectionRequestProjectStatusProjectsDialog({
  projects,
  thresholds,
}: UtilityInspectionRequestProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <UtilityInspectionRequestDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function InstallationCompletionProjectStatusProjectsDialog({
  projects,
  thresholds,
}: InstallationCompletionProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <InstallationCompletionDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function CompletionValidationProjectStatusProjectsDialog({
  projects,
  thresholds,
}: CompletionValidationProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <CompletionValidationDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

function TechnicalInspectionValidationProjectStatusProjectsDialog({
  projects,
  thresholds,
}: TechnicalInspectionValidationProjectStatusProjectsDialogProps) {
  const { selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

  return (
    <ProjectStatusProjectsDialogContent filteredProjects={filteredProjects}>
      <TechnicalInspectionValidationDataTable
        data={filteredProjects}
        pageSize={10}
        thresholds={thresholds}
      />
    </ProjectStatusProjectsDialogContent>
  );
}

export function ProjectStatusProjectsDialog(
  props: ProjectStatusProjectsDialogProps
) {
  if (props.source === "inspectionApproval") {
    return <InspectionApprovalProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "accessRequest") {
    return <AccessRequestProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "artAccessRequirement") {
    return <ArtAccessRequirementProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "utilityInspectionRequest") {
    return <UtilityInspectionRequestProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "installationCompletion") {
    return <InstallationCompletionProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "completionValidation") {
    return <CompletionValidationProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "technicalInspectionValidation") {
    return (
      <TechnicalInspectionValidationProjectStatusProjectsDialog {...props} />
    );
  }

  return <RequestProtocolProjectStatusProjectsDialog {...props} />;
}
