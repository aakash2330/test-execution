import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  username: z.string(),
  status: z.string(),
  executionTime: z.string(),
  submissionTime: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
