import { pathRouter } from "@/server/api/routers/path";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { sessionRouter } from "./routers/session";
import { configRouter } from "./routers/config";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  path: pathRouter,
  session: sessionRouter,
  config: configRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
