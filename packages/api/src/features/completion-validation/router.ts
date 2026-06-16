import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { completionValidationStatusThresholdsSchema } from "./schema";
import * as completionValidationService from "./service";

export const completionValidationRouter = router({
  getProjects: protectedProcedure.query(() =>
    completionValidationService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    completionValidationService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(completionValidationStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await completionValidationService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
