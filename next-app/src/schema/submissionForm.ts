import { z } from "zod";

export const submissionformSchema = z.object({
  username: z.string().min(1).max(50),
  backendUrl: z.string().min(1),
  websocketUrl: z.string().min(1),
});
