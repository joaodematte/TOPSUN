import { TRPCError } from "@trpc/server";

import { router } from "../../trpc/init";
import { protectedProcedure } from "../../trpc/procedures";
import {
  getAutomationByKindSchema,
  getAutomationRunReportSchema,
  startAutomationSchema,
} from "./schema";
import * as automationService from "./service";

const VISIBLE_LOG_LEVELS = new Set(["info", "step", "success", "error"]);

export const automationRouter = router({
  getHistory: protectedProcedure
    .input(getAutomationByKindSchema)
    .query(({ input }) => automationService.getHistory(input.kind)),

  getLogs: protectedProcedure
    .input(getAutomationByKindSchema)
    .query(async ({ input }) => {
      const logs = await automationService.getLogs(input.kind);

      return logs
        .filter((log) => VISIBLE_LOG_LEVELS.has(log.level))
        .map((log) => ({
          id: log.id,
          level: log.level as "error" | "info" | "step" | "success",
          message: log.message,
          timestamp: log.createdAt.toISOString(),
        }));
    }),

  getRunReport: protectedProcedure
    .input(getAutomationRunReportSchema)
    .query(async ({ input }) => {
      const report = await automationService.getRunReport(
        input.kind,
        input.automationId
      );

      if (!report) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Execução não encontrada.",
        });
      }

      return report;
    }),

  getStatus: protectedProcedure
    .input(getAutomationByKindSchema)
    .query(({ input }) => automationService.getStatus(input.kind)),

  start: protectedProcedure
    .input(startAutomationSchema)
    .mutation(async ({ input }) => {
      try {
        return await automationService.startAutomation(input.kind);
      } catch (error) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível iniciar a automação.",
        });
      }
    }),
});
