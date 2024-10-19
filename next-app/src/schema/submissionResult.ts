import { z } from "zod";

export const submissionResultSchema = z.object({
  id: z.number().min(1),
  executionTime: z.string().min(1),
  status: z.string().min(1),
});
