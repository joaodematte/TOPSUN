import { createFileRoute } from "@tanstack/react-router";

import { AutomationRunReportPage } from "@/features/automation/components/automation-run-report-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/automation/validate-protocol-return/$automationId/"
)({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: getTitle("Relatório de Retorno de Protocolo"),
      },
    ],
  }),
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(
      context.trpc.automation.getRunReport.queryOptions({
        automationId: params.automationId,
        kind: "validate_protocol_return",
      })
    );
  },
});

function RouteComponent() {
  const { automationId } = Route.useParams();

  return (
    <AutomationRunReportPage
      automationId={automationId}
      kind="validate_protocol_return"
    />
  );
}
