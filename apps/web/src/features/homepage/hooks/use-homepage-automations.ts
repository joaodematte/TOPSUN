import { useQueries } from "@tanstack/react-query";

import {
  AUTOMATION_DASHBOARD_ROUTE_BY_KIND,
  AUTOMATION_KIND_CONFIG,
} from "@/features/automation/config";
import type { AutomationKind } from "@/features/automation/config";
import { AUTOMATION_KINDS } from "@/features/homepage/utils/homepage-sources";
import { useTRPC } from "@/features/platform/api/trpc";

export interface HomepageAutomationInsight {
  dashboardHref: (typeof AUTOMATION_DASHBOARD_ROUTE_BY_KIND)[AutomationKind];
  description: string;
  isError: boolean;
  isLoading: boolean;
  isRunning: boolean;
  kind: AutomationKind;
  lastExecutionAt: string | null;
  lastExecutionStats: {
    failed: number;
    succeeded: number;
  } | null;
  title: string;
}

export function useHomepageAutomations() {
  const trpc = useTRPC();

  const statusQueries = useQueries({
    queries: AUTOMATION_KINDS.map((kind) => ({
      ...trpc.automation.getStatus.queryOptions({ kind }),
      refetchInterval: (query: { state: { data?: { isRunning?: boolean } } }) =>
        query.state.data?.isRunning ? 2000 : false,
    })),
  });

  const automations = AUTOMATION_KINDS.map((kind, index) => {
    const statusQuery = statusQueries[index];
    const config = AUTOMATION_KIND_CONFIG[kind];

    return {
      dashboardHref: AUTOMATION_DASHBOARD_ROUTE_BY_KIND[kind],
      description: config.description,
      isError: Boolean(statusQuery?.isError),
      isLoading: Boolean(statusQuery?.isLoading),
      isRunning: statusQuery?.data?.isRunning ?? false,
      kind,
      lastExecutionAt: statusQuery?.data?.lastExecutionAt ?? null,
      lastExecutionStats: statusQuery?.data?.lastExecutionStats ?? null,
      title: config.title,
    } satisfies HomepageAutomationInsight;
  });

  const isLoading = automations.some((automation) => automation.isLoading);
  const hasRunningAutomation = automations.some(
    (automation) => automation.isRunning
  );

  return {
    automations,
    hasRunningAutomation,
    isLoading,
  };
}
