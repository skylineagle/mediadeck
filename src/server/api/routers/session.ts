import type { SessionResponse } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import ky from "ky";

export const sessionRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const response = await ky
      .get<SessionResponse>("http://localhost:9997/v3/rtspsessions/list")
      .json();

    console.log(response);

    return response.items ?? [];
  }),
});
