import { createFileRoute } from "@tanstack/react-router";

import { InspectionApprovalPage } from "@/features/inspection-approval/routes/inspection-approval-page";
import { getTitle } from "@/shared/utils/get-title";

export const Route = createFileRoute("/_protected/inspection-approval/")({
  component: InspectionApprovalPage,
  head: () => ({
    meta: [
      {
        title: getTitle("Aprovação de vistoria (concessionária)"),
      },
    ],
  }),
});
