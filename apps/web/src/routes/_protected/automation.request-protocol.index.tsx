import { createFileRoute } from "@tanstack/react-router";

import { AutomationDashboardPage } from "@/features/automation/components/automation-dashboard-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/request-protocol/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Automação de Solicitação de Protocolo"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getStatus.queryOptions({
        kind: "request_protocol",
      })
    );
    context.queryClient.prefetchQuery(
      context.trpc.automation.getLogs.queryOptions({
        kind: "request_protocol",
      })
    );
    context.queryClient.prefetchQuery(
      context.trpc.automation.getHistory.queryOptions({
        kind: "request_protocol",
      })
    );
  },
});

function RouteComponent() {
  return (
    <AutomationDashboardPage kind="request_protocol" showExecutionHistory />
  );
}
