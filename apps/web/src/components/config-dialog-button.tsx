"use client";

import { IconSettings } from "@tabler/icons-react";
import { Button } from "@topsun/ui/components/button";
import { useState } from "react";

import { ConfigDialog } from "@/components/config-dialog";
import type { DashboardSource } from "@/utils/dashboard-source";
import type { ProjectStatusThresholds } from "@/utils/project-status";

interface ConfigDialogButtonProps {
  defaultValues: ProjectStatusThresholds;
  source?: DashboardSource;
}

export function ConfigDialogButton({
  defaultValues,
  source = "requestProtocol",
}: ConfigDialogButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <IconSettings />
        Configurações
      </Button>
      <ConfigDialog
        defaultValues={defaultValues}
        onOpenChange={setOpen}
        open={open}
        source={source}
      />
    </>
  );
}
