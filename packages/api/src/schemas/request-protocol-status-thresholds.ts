import z from "zod";

export const requestProtocolStatusThresholdsSchema = z
  .object({
    attention: z.number().int().min(0),
    critical: z.number().int().min(0),
    onTime: z.number().int().min(0),
  })
  .refine((values) => values.attention >= values.onTime, {
    message: "Atenção não pode ser menor que No prazo.",
    path: ["attention"],
  })
  .refine((values) => values.critical >= values.attention, {
    message: "Críticos não pode ser menor que Atenção.",
    path: ["critical"],
  });

export type RequestProtocolStatusThresholdsInput = z.infer<
  typeof requestProtocolStatusThresholdsSchema
>;
