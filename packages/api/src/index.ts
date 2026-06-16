export type { AppRouter, RouterInputs, RouterOutputs } from "./trpc/router";
export { appRouter } from "./trpc/router";

export { createContext } from "./trpc/context";
export type { Context, CreateContextOptions } from "./trpc/context";

export { publicProcedure, protectedProcedure } from "./trpc/procedures";
export { router } from "./trpc/init";

export {
  requestProtocolStatusThresholdsSchema,
  type RequestProtocolStatusThresholdsInput,
} from "./features/request-protocol/schema";

export {
  inspectionApprovalStatusThresholdsSchema,
  type InspectionApprovalStatusThresholdsInput,
} from "./features/inspection-approval/schema";

export {
  accessRequestStatusThresholdsSchema,
  type AccessRequestStatusThresholdsInput,
} from "./features/access-request/schema";

export {
  artAccessRequirementStatusThresholdsSchema,
  type ArtAccessRequirementStatusThresholdsInput,
} from "./features/art-access-requirement/schema";

export {
  utilityInspectionRequestStatusThresholdsSchema,
  type UtilityInspectionRequestStatusThresholdsInput,
} from "./features/utility-inspection-request/schema";

export {
  installationCompletionStatusThresholdsSchema,
  type InstallationCompletionStatusThresholdsInput,
} from "./features/installation-completion/schema";

export {
  technicalInspectionValidationStatusThresholdsSchema,
  type TechnicalInspectionValidationStatusThresholdsInput,
} from "./features/technical-inspection-validation/schema";

export {
  completionValidationStatusThresholdsSchema,
  type CompletionValidationStatusThresholdsInput,
} from "./features/completion-validation/schema";
