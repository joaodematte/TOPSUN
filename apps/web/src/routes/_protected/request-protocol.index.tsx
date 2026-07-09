import { createFileRoute } from "@tanstack/react-router";

import { RequestProtocolPage } from "@/features/request-protocol/routes/request-protocol-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/request-protocol/")({
  component: RequestProtocolPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Solicitação de protocolo"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.requestProtocol.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.requestProtocol.getStatusThresholds.queryOptions()
    );
  },
});
