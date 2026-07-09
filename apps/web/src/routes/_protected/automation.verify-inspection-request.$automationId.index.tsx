import { createFileRoute } from "@tanstack/react-router";

import { AutomationRunReportPage } from "@/features/automation/components/automation-run-report-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/verify-inspection-request/$automationId/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Relatório de Verificação de Solicitação de Vistoria"),
      },
    ],
  }),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getRunReport.queryOptions({
        automationId: params.automationId,
        kind: "verify_inspection_request",
      })
    );
  },
});

function RouteComponent() {
  const { automationId } = Route.useParams();

  return (
    <AutomationRunReportPage
      automationId={automationId}
      kind="verify_inspection_request"
    />
  );
}
