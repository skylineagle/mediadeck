import { pathRouter } from "@/server/api/routers/path";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/session";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  path: pathRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
