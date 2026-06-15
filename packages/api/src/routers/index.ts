import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../index";
import { inspectionApprovalRouter } from "./inspection-approval";
import { requestProtocolRouter } from "./request-protocol";

export const appRouter = router({
  inspectionApproval: inspectionApprovalRouter,
  requestProtocol: requestProtocolRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<typeof appRouter>;
export type RouterInputs = inferRouterInputs<typeof appRouter>;
