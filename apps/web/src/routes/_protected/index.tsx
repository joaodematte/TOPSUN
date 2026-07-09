import { createFileRoute } from "@tanstack/react-router";

import { Homepage } from "@/features/homepage/routes/homepage";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/")({
  component: Homepage,
  head: () => ({
    meta: [
      {
        title: getTitle("Visão geral"),
      },
    ],
  }),
});
