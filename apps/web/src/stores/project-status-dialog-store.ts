import { create } from "zustand";

import type { ProjectStatusFilter } from "@/utils/project-status";

interface ProjectStatusDialogState {
  closeDialog: () => void;
  open: boolean;
  openDialog: (status: ProjectStatusFilter) => void;
  selectedStatus: ProjectStatusFilter | null;
}

export const useProjectStatusDialogStore = create<ProjectStatusDialogState>(
  (set) => ({
    closeDialog: () => set({ open: false }),
    open: false,
    openDialog: (status) => set({ open: true, selectedStatus: status }),
    selectedStatus: null,
  })
);
