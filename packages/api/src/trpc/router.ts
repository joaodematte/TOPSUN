import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { accessRequestRouter } from "../features/access-request/router";
import { artAccessRequirementRouter } from "../features/art-access-requirement/router";
import { completionValidationRouter } from "../features/completion-validation/router";
import { inspectionApprovalRouter } from "../features/inspection-approval/router";
import { installationCompletionRouter } from "../features/installation-completion/router";
import { requestProtocolRouter } from "../features/request-protocol/router";
import { technicalInspectionValidationRouter } from "../features/technical-inspection-validation/router";
import { utilityInspectionRequestRouter } from "../features/utility-inspection-request/router";
import { router } from "./init";

export const appRouter = router({
  accessRequest: accessRequestRouter,
  artAccessRequirement: artAccessRequirementRouter,
  completionValidation: completionValidationRouter,
  inspectionApproval: inspectionApprovalRouter,
  installationCompletion: installationCompletionRouter,
  requestProtocol: requestProtocolRouter,
  technicalInspectionValidation: technicalInspectionValidationRouter,
  utilityInspectionRequest: utilityInspectionRequestRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<typeof appRouter>;
export type RouterInputs = inferRouterInputs<typeof appRouter>;
