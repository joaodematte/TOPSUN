import { createFileRoute } from "@tanstack/react-router";

import { CompletionValidationPage } from "@/features/completion-validation/routes/completion-validation-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/completion-validation/")({
  component: CompletionValidationPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Validação da conclusão"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.completionValidation.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.completionValidation.getStatusThresholds.queryOptions()
    );
  },
});
