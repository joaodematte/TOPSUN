import { z } from "zod";

export const automationKindSchema = z.enum([
  "request_protocol",
  "validate_protocol_return",
]);

export type AutomationKindInput = z.infer<typeof automationKindSchema>;

export const startAutomationSchema = z.object({
  kind: automationKindSchema,
});

export const getAutomationByKindSchema = z.object({
  kind: automationKindSchema,
});

export const getAutomationRunReportSchema = z.object({
  automationId: z.string().uuid(),
  kind: automationKindSchema,
});
