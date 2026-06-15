import {
  getInspectionApprovalStatusThresholds,
  upsertInspectionApprovalStatusThresholds,
} from "@topsun/db/postgres-queries";
import { getProjectsOnInspectionApprovalConcessionary } from "@topsun/db/queries";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, router } from "..";
import { inspectionApprovalStatusThresholdsSchema } from "../schemas/inspection-approval-status-thresholds";

export const inspectionApprovalRouter = router({
  getProjects: protectedProcedure.query(async () => {
    const data = await getProjectsOnInspectionApprovalConcessionary();

    return data;
  }),
  getStatusThresholds: protectedProcedure.query(async () => {
    const data = await getInspectionApprovalStatusThresholds();

    return data;
  }),
  saveStatusThresholds: protectedProcedure
    .input(inspectionApprovalStatusThresholdsSchema)
    .mutation(async ({ input }) => {
      try {
        return await upsertInspectionApprovalStatusThresholds(input);
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Não foi possível salvar as configurações. Tente novamente.",
        });
      }
    }),
});
