import { createFileRoute } from "@tanstack/react-router";

import { AutomationDashboardPage } from "@/features/automation/components/automation-dashboard-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/validate-protocol-return/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Automação de Retorno de Protocolo"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getStatus.queryOptions({
        kind: "validate_protocol_return",
      })
    );
    context.queryClient.prefetchQuery(
      context.trpc.automation.getLogs.queryOptions({
        kind: "validate_protocol_return",
      })
    );
  },
});

function RouteComponent() {
  return <AutomationDashboardPage kind="validate_protocol_return" />;
}
