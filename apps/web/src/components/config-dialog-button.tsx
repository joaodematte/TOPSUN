"use client";

import { IconSettings } from "@tabler/icons-react";
import { Button } from "@topsun/ui/components/button";
import { useState } from "react";

interface ConfigDialogButtonProps {
  defaultValues: {
    attention: number;
    critical: number;
    onTime: number;
  };
}

export function ConfigDialogButton({ defaultValues }: ConfigDialogButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Button onClick={() => setOpen(true)} variant="outline">
      <IconSettings />
      Configurações
    </Button>
  );
}
