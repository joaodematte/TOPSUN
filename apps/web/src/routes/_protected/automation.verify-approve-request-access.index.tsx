import { createFileRoute } from "@tanstack/react-router";

import { AutomationDashboardPage } from "@/features/automation/components/automation-dashboard-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/verify-approve-request-access/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Automação de Verificação de Solicitação de Acesso"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getStatus.queryOptions({
        kind: "verify_approve_request_access",
      })
    );
    context.queryClient.prefetchQuery(
      context.trpc.automation.getLogs.queryOptions({
        kind: "verify_approve_request_access",
      })
    );
    context.queryClient.prefetchQuery(
      context.trpc.automation.getHistory.queryOptions({
        kind: "verify_approve_request_access",
      })
    );
  },
});

function RouteComponent() {
  return (
    <AutomationDashboardPage
      kind="verify_approve_request_access"
      showExecutionHistory
    />
  );
}
