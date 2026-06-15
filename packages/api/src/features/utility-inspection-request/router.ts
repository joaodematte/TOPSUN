import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { utilityInspectionRequestStatusThresholdsSchema } from "./schema";
import * as utilityInspectionRequestService from "./service";

export const utilityInspectionRequestRouter = router({
  getProjects: protectedProcedure.query(() =>
    utilityInspectionRequestService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    utilityInspectionRequestService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(utilityInspectionRequestStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await utilityInspectionRequestService.saveStatusThresholds(
          input
        );
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
