import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { AutomationKind } from "@/features/automation/config";
import { useTRPC } from "@/features/platform/api/trpc";

export function useAutomationDashboard(kind: AutomationKind) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    ...trpc.automation.getStatus.queryOptions({ kind }),
    refetchInterval: (query) =>
      query.state.data?.isRunning ? 2000 : false,
  });

  const logsQuery = useQuery({
    ...trpc.automation.getLogs.queryOptions({ kind }),
    refetchInterval: statusQuery.data?.isRunning ? 2000 : false,
  });

  const startMutation = useMutation(
    trpc.automation.start.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.automation.getStatus.queryKey({ kind }),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.automation.getLogs.queryKey({ kind }),
          }),
        ]);
      },
    })
  );

  return {
    currentStep: statusQuery.data?.currentStep ?? null,
    isLoading: statusQuery.isLoading || logsQuery.isLoading,
    isRunning: statusQuery.data?.isRunning ?? false,
    isStarting: startMutation.isPending,
    lastExecutionAt: statusQuery.data?.lastExecutionAt ?? null,
    lastExecutionStats: statusQuery.data?.lastExecutionStats ?? null,
    logs: logsQuery.data ?? [],
    startAutomation: () => startMutation.mutate({ kind }),
    startError: startMutation.error,
  };
}
