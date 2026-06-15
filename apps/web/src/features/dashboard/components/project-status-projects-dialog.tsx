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
import { useProjectStatusDialogStore } from "@/features/dashboard/stores/project-status-dialog-store";
import {
  filterProjectsByStatus,
  PROJECT_STATUS_FILTER_LABEL,
} from "@/features/dashboard/utils/project-status";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";
import { InspectionApprovalDataTable } from "@/features/inspection-approval/components/inspection-approval-data-table";
import { RequestProtocolDataTable } from "@/features/request-protocol/components/request-protocol-data-table";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

type ProjectOnInspectionApproval =
  RouterOutputs["inspectionApproval"]["getProjects"][number];

type ProjectOnAccessRequest =
  RouterOutputs["accessRequest"]["getProjects"][number];

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

type ProjectStatusProjectsDialogProps =
  | RequestProtocolProjectStatusProjectsDialogProps
  | InspectionApprovalProjectStatusProjectsDialogProps
  | AccessRequestProjectStatusProjectsDialogProps;

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

export function ProjectStatusProjectsDialog(
  props: ProjectStatusProjectsDialogProps
) {
  if (props.source === "inspectionApproval") {
    return <InspectionApprovalProjectStatusProjectsDialog {...props} />;
  }

  if (props.source === "accessRequest") {
    return <AccessRequestProjectStatusProjectsDialog {...props} />;
  }

  return <RequestProtocolProjectStatusProjectsDialog {...props} />;
}
