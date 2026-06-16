import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { technicalInspectionValidationStatusThresholdsSchema } from "./schema";
import * as technicalInspectionValidationService from "./service";

export const technicalInspectionValidationRouter = router({
  getProjects: protectedProcedure.query(() =>
    technicalInspectionValidationService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    technicalInspectionValidationService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(technicalInspectionValidationStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await technicalInspectionValidationService.saveStatusThresholds(
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
