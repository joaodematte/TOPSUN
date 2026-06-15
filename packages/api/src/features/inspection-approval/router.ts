import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { inspectionApprovalStatusThresholdsSchema } from "./schema";
import * as inspectionApprovalService from "./service";

export const inspectionApprovalRouter = router({
  getProjects: protectedProcedure.query(() =>
    inspectionApprovalService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    inspectionApprovalService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(inspectionApprovalStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await inspectionApprovalService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
