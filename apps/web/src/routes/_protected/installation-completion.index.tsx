import { createFileRoute } from "@tanstack/react-router";

import { InstallationCompletionPage } from "@/features/installation-completion/routes/installation-completion-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/installation-completion/")({
  component: InstallationCompletionPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Conclusão da instalação"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.installationCompletion.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.installationCompletion.getStatusThresholds.queryOptions()
    );
  },
});
