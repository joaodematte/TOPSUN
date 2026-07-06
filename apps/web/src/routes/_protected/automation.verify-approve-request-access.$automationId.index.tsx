import { createFileRoute } from "@tanstack/react-router";

import { AutomationRunReportPage } from "@/features/automation/components/automation-run-report-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/verify-approve-request-access/$automationId/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Relatório de Verificação de Solicitação de Acesso"),
      },
    ],
  }),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getRunReport.queryOptions({
        automationId: params.automationId,
        kind: "verify_approve_request_access",
      })
    );
  },
});

function RouteComponent() {
  const { automationId } = Route.useParams();

  return (
    <AutomationRunReportPage
      automationId={automationId}
      kind="verify_approve_request_access"
    />
  );
}
