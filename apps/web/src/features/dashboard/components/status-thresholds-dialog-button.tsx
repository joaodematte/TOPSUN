"use client";

import { IconSettings } from "@tabler/icons-react";
import { Button } from "@topsun/ui/components/button";
import { useState } from "react";

import { StatusThresholdsDialog } from "@/features/dashboard/components/status-thresholds-dialog";
import type { DashboardSource } from "@/features/dashboard/utils/dashboard-source";
import type { ProjectStatusThresholds } from "@/features/dashboard/utils/project-status";

interface StatusThresholdsDialogButtonProps {
  defaultValues: ProjectStatusThresholds;
  source?: DashboardSource;
}

export function StatusThresholdsDialogButton({
  defaultValues,
  source = "requestProtocol",
}: StatusThresholdsDialogButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <IconSettings />
        Configurações
      </Button>
      <StatusThresholdsDialog
        defaultValues={defaultValues}
        onOpenChange={setOpen}
        open={open}
        source={source}
      />
    </>
  );
}
