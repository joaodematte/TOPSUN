import { createFileRoute } from "@tanstack/react-router";

import { ArtAccessRequirementPage } from "@/features/art-access-requirement/routes/art-access-requirement-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/art-access-requirement/")({
  component: ArtAccessRequirementPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Emissão de ART e requerimento de acesso"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.artAccessRequirement.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.artAccessRequirement.getStatusThresholds.queryOptions()
    );
  },
});
