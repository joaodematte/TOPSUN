import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { accessRequestRouter } from "../features/access-request/router";
import { inspectionApprovalRouter } from "../features/inspection-approval/router";
import { requestProtocolRouter } from "../features/request-protocol/router";
import { router } from "./init";

export const appRouter = router({
  accessRequest: accessRequestRouter,
  inspectionApproval: inspectionApprovalRouter,
  requestProtocol: requestProtocolRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutputs = inferRouterOutputs<typeof appRouter>;
export type RouterInputs = inferRouterInputs<typeof appRouter>;
