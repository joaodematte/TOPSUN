import { createFileRoute } from "@tanstack/react-router";

import { TechnicalInspectionValidationPage } from "@/features/technical-inspection-validation/routes/technical-inspection-validation-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute(
  "/_protected/technical-inspection-validation/"
)({
  component: TechnicalInspectionValidationPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Validação da vistoria técnica"),
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(
      context.trpc.technicalInspectionValidation.getProjects.queryOptions()
    );
    context.queryClient.prefetchQuery(
      context.trpc.technicalInspectionValidation.getStatusThresholds.queryOptions()
    );
  },
});
