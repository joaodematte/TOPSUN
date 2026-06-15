import { createFileRoute } from "@tanstack/react-router";

import { UtilityInspectionRequestPage } from "@/features/utility-inspection-request/routes/utility-inspection-request-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/utility-inspection-request/")(
  {
    component: UtilityInspectionRequestPage,
    head: () => ({
      meta: [
        {
          title: getTitle("Solicitação de vistoria pela concessionária"),
        },
      ],
    }),
    loader: ({ context }) => {
      context.queryClient.prefetchQuery(
        context.trpc.utilityInspectionRequest.getProjects.queryOptions()
      );
      context.queryClient.prefetchQuery(
        context.trpc.utilityInspectionRequest.getStatusThresholds.queryOptions()
      );
    },
  }
);
