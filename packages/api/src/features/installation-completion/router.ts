import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { installationCompletionStatusThresholdsSchema } from "./schema";
import * as installationCompletionService from "./service";

export const installationCompletionRouter = router({
  getProjects: protectedProcedure.query(() =>
    installationCompletionService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    installationCompletionService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(installationCompletionStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await installationCompletionService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
