import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import { requestProtocolStatusThresholdsSchema } from "./schema";
import * as requestProtocolService from "./service";

export const requestProtocolRouter = router({
  getProjects: protectedProcedure.query(() =>
    requestProtocolService.getProjects()
  ),
  getStatusThresholds: protectedProcedure.query(() =>
    requestProtocolService.getStatusThresholds()
  ),
  saveStatusThresholds: protectedProcedure
    .input(requestProtocolStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await requestProtocolService.saveStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
