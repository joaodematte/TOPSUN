import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AutomationKind } from "@/features/automation/config";
import { useTRPC } from "@/features/platform/api/trpc";

interface UseAutomationDashboardOptions {
  includeHistory?: boolean;
}

function invalidateAutomationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  trpc: ReturnType<typeof useTRPC>,
  kind: AutomationKind,
  includeHistory: boolean
) {
  const invalidations = [
    queryClient.invalidateQueries({
      queryKey: trpc.automation.getStatus.queryKey({ kind }),
    }),
    queryClient.invalidateQueries({
      queryKey: trpc.automation.getLogs.queryKey({ kind }),
    }),
  ];

  if (includeHistory) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: trpc.automation.getHistory.queryKey({ kind }),
      })
    );
  }

  return Promise.all(invalidations);
}

function useAutomationHistoryQuery(
  kind: AutomationKind,
  includeHistory: boolean,
  isRunning: boolean
) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.automation.getHistory.queryOptions({ kind }),
    enabled: includeHistory,
    refetchInterval: isRunning ? 2000 : false,
  });
}

export function useAutomationDashboard(
  kind: AutomationKind,
  options: UseAutomationDashboardOptions = {}
) {
  const { includeHistory = false } = options;
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    ...trpc.automation.getStatus.queryOptions({ kind }),
    refetchInterval: (query) => (query.state.data?.isRunning ? 2000 : false),
  });

  const isRunning = statusQuery.data?.isRunning ?? false;

  const logsQuery = useQuery({
    ...trpc.automation.getLogs.queryOptions({ kind }),
    refetchInterval: isRunning ? 2000 : false,
  });

  const historyQuery = useAutomationHistoryQuery(
    kind,
    includeHistory,
    isRunning
  );

  const startMutation = useMutation(
    trpc.automation.start.mutationOptions({
      onSuccess: () =>
        invalidateAutomationQueries(queryClient, trpc, kind, includeHistory),
    })
  );

  return {
    currentStep: statusQuery.data?.currentStep ?? null,
    history: historyQuery.data ?? [],
    isLoading:
      statusQuery.isLoading ||
      logsQuery.isLoading ||
      (includeHistory && historyQuery.isLoading),
    isRunning,
    isStarting: startMutation.isPending,
    lastExecutionAt: statusQuery.data?.lastExecutionAt ?? null,
    lastExecutionStats: statusQuery.data?.lastExecutionStats ?? null,
    logs: logsQuery.data ?? [],
    startAutomation: () => startMutation.mutate({ kind }),
    startError: startMutation.error,
  };
}
