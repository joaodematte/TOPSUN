import { createFileRoute } from "@tanstack/react-router";

import { RequestProtocolPage } from "@/features/request-protocol/routes/request-protocol-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/")({
  component: RequestProtocolPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Solicitação de Protocolo"),
      },
    ],
  }),
});
