import {
  getRequestProtocolStatusThresholds,
  upsertRequestProtocolStatusThresholds,
} from "@topsun/db/postgres-queries";
import { getProjectsOnRequestProtocol } from "@topsun/db/queries";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "..";
import { requestProtocolStatusThresholdsSchema } from "../schemas/request-protocol-status-thresholds";

export const requestProtocolRouter = router({
  getProjects: protectedProcedure.query(async () => {
    const data = await getProjectsOnRequestProtocol();

    return data;
  }),
  getStatusThresholds: protectedProcedure.query(async () => {
    const data = await getRequestProtocolStatusThresholds();

    return data;
  }),
  saveStatusThresholds: protectedProcedure
    .input(requestProtocolStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await upsertRequestProtocolStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
