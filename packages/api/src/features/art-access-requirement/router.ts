import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { artAccessRequirementStatusThresholdsSchema } from "./schema";
import * as artAccessRequirementService from "./service";

export const artAccessRequirementRouter = router({
  getProjects: protectedProcedure.query(() =>
    artAccessRequirementService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    artAccessRequirementService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(artAccessRequirementStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await artAccessRequirementService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
