"use client";

import type { RouterOutputs } from "@topsun/api/routers/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@topsun/ui/components/dialog";

import { InspectionApprovalDataTable } from "@/components/inspection-approval-data-table";
import { RequestProtocolDataTable } from "@/components/request-protocol-data-table";
import { useProjectStatusDialogStore } from "@/stores/project-status-dialog-store";
import {
  filterProjectsByStatus,
  PROJECT_STATUS_FILTER_LABEL,
} from "@/utils/project-status";
import type { ProjectStatusThresholds } from "@/utils/project-status";

type ProjectOnRequestProtocol =
  RouterOutputs["requestProtocol"]["getProjects"][number];

type ProjectOnInspectionApproval =
  RouterOutputs["inspectionApproval"]["getProjects"][number];

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

type ProjectStatusProjectsDialogProps =
  | RequestProtocolProjectStatusProjectsDialogProps
  | InspectionApprovalProjectStatusProjectsDialogProps;

function RequestProtocolProjectStatusProjectsDialog({
  projects,
  thresholds,
}: RequestProtocolProjectStatusProjectsDialogProps) {
  const { closeDialog, open, selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

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
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <RequestProtocolDataTable
            data={filteredProjects}
            pageSize={10}
            thresholds={thresholds}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InspectionApprovalProjectStatusProjectsDialog({
  projects,
  thresholds,
}: InspectionApprovalProjectStatusProjectsDialogProps) {
  const { closeDialog, open, selectedStatus } = useProjectStatusDialogStore();

  const filteredProjects =
    selectedStatus === null
      ? []
      : filterProjectsByStatus(projects, thresholds, selectedStatus);

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
        <div className="min-h-0 min-w-0 flex-1 overflow-auto">
          <InspectionApprovalDataTable
            data={filteredProjects}
            pageSize={10}
            thresholds={thresholds}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectStatusProjectsDialog(
  props: ProjectStatusProjectsDialogProps
) {
  if (props.source === "inspectionApproval") {
    return <InspectionApprovalProjectStatusProjectsDialog {...props} />;
  }

  return <RequestProtocolProjectStatusProjectsDialog {...props} />;
}
