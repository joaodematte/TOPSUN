import { createFileRoute } from "@tanstack/react-router";

import { AccessRequestPage } from "@/features/access-request/routes/access-request-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/access-request/")({
  component: AccessRequestPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Solicitação de acesso"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.accessRequest.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.accessRequest.getStatusThresholds.queryOptions()
    );
  },
});
