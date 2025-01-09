import { z } from "zod";

export const withMtxUrl = z.object({
  mtxUrl: z.string().url(),
});
