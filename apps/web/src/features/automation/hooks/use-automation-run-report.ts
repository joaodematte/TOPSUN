import { useQuery } from "@tanstack/react-query";

import type { AutomationKind } from "@/features/automation/config";
import { useTRPC } from "@/features/platform/api/trpc";

export function useAutomationRunReport(
  kind: AutomationKind,
  automationId: string
) {
  const trpc = useTRPC();

  const reportQuery = useQuery({
    ...trpc.automation.getRunReport.queryOptions({ automationId, kind }),
    refetchInterval: (query) =>
      query.state.data?.status === "running" ? 2000 : false,
  });

  return {
    isLoading: reportQuery.isLoading,
    report: reportQuery.data ?? null,
  };
}
