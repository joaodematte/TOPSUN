import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { accessRequestStatusThresholdsSchema } from "./schema";
import * as accessRequestService from "./service";

export const accessRequestRouter = router({
  getProjects: protectedProcedure.query(() =>
    accessRequestService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    accessRequestService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(accessRequestStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await accessRequestService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
