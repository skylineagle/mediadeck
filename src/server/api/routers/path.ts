import { env } from "@/env";
import { pathSchema } from "@/lib/schemas/path.schema";
import type { Path, PathConfig } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paths } from "@/server/db/schema";
import type { EnhancedPath } from "@/types";
import { eq } from "drizzle-orm";
import ky, { HTTPError } from "ky";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPathConfigs, listActivePaths, parseDbPaths } from "./utils";

export const pathRouter = createTRPCRouter({
  getAllPaths: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.query.paths.findMany({
      orderBy: (paths, { asc }) => [asc(paths.name)],
    });

    const dbPaths = parseDbPaths(result);
    const pathConfigs = await getPathConfigs();
    const activePaths = await listActivePaths();

    const enhancedPaths: EnhancedPath[] = [
      ...activePaths.map((path) => ({
        ...(pathConfigs.find((p) => p.name === path.name) ?? path),
        isInDb: dbPaths.some((p) => p.name === path.name),
        isActive: true,
      })),
      ...dbPaths
        .filter((path) => !activePaths.some((ap) => ap.name === path.name))
        .map((path) => ({
          ...path,
          isInDb: true,
          isActive: false,
        })),
    ];

    console.log(pathConfigs);

    return enhancedPaths;
  }),

  create: publicProcedure.input(pathSchema).mutation(async ({ ctx, input }) => {
    try {
      // Add to Media MTX
      const response = await fetch(
        `${env.MEDIAMTX_API_URL}/v3/config/paths/add/${input.name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        },
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      // Add to database with boolean to string conversion

      // Get the created path from MediaMTX to ensure we have the latest data
      const createdPath = await ky
        .get<PathConfig>(
          `${env.MEDIAMTX_API_URL}/v3/config/paths/get/${input.name}`,
        )
        .json();

      if (!createdPath)
        throw new Error("Failed to get created path from MediaMTX");

      await ctx.db.insert(paths).values({
        ...createdPath,
        name: input.name,
      });

      revalidatePath("/");
      return { success: true };
    } catch (error) {
      throw error;
    }
  }),

  sync: publicProcedure.input(pathSchema).mutation(async ({ ctx, input }) => {
    // Add to database
    // Check if this is a session path (no source) and add it to MediaMTX if so
    console.log(input);

    if (!input.source) {
      const response = await fetch(
        `${env.MEDIAMTX_API_URL}/v3/config/paths/add/${input.name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...input, source: "publisher" }),
        },
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }
    }
    await ctx.db.insert(paths).values({
      ...input,
    });
    revalidatePath("/");
  }),

  remove: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      // Remove from MediaMTX
      // Get path data from database
      const pathData = await ctx.db.query.paths.findFirst({
        where: eq(paths.name, name),
      });

      if (!pathData) throw new Error("Path not found");

      // Check if path exists on MediaMTX
      try {
        const response = await ky.get(
          `${env.MEDIAMTX_API_URL}/v3/config/paths/get/${name}`,
        );

        if (response.status === 200) {
          await ky.delete(
            `${env.MEDIAMTX_API_URL}/v3/config/paths/delete/${name}`,
          );
        }
      } catch (error) {
        if (!(error instanceof HTTPError && error.response.status === 404)) {
          throw error;
        }
      }

      // Remove from database
      await ctx.db.delete(paths).where(eq(paths.name, name));

      revalidatePath("/");
      return { success: true };
    }),

  toggle: publicProcedure
    .input(z.object({ name: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { name, enabled } = input;
      // Update MediaMTX
      if (enabled) {
        // Get path data from database
        const pathData = await ctx.db.query.paths.findFirst({
          where: eq(paths.name, name),
        });

        if (!pathData) throw new Error("Path not found");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, id, ...info } = pathData;

        // Add to MediaMTX
        const response = await ky.post(
          `${env.MEDIAMTX_API_URL}/v3/config/paths/add/${info.name}`,
          {
            json: info,
          },
        );

        if (!response.ok) {
          console.error(response);
          throw new Error("Failed to add path to MediaMTX");
        }
      } else {
        // Remove from MediaMTX
        const response = await ky.delete(
          `${env.MEDIAMTX_API_URL}/v3/config/paths/delete/${name}`,
        );

        if (!response.ok) {
          throw new Error("Failed to remove path from MediaMTX");
        }
      }

      revalidatePath("/");
      return { success: true };
    }),

  getPathState: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const { name } = input;
      try {
        const path = await ky
          .get<Path>(`${env.MEDIAMTX_API_URL}/v3/paths/get/${name}`)
          .json();

        return path;
      } catch (error) {
        if (error instanceof HTTPError) {
          if (error.response.status === 404) {
            return null;
          }
        }
        throw error;
      }
    }),

  healthcheck: publicProcedure.query(async () => {
    try {
      await ky.get(`${env.MEDIAMTX_API_URL}/v3/paths/list`).json();
      return { isConnected: true };
    } catch {
      return { isConnected: false };
    }
  }),

  getPathConfig: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      const { name } = input;
      const response = await ky
        .get<PathConfig>(`${env.MEDIAMTX_API_URL}/v3/config/paths/get/${name}`)
        .json();
      return response;
    }),

  update: publicProcedure.input(pathSchema).mutation(async ({ ctx, input }) => {
    try {
      // Update in Media MTX
      const response = await fetch(
        `${env.MEDIAMTX_API_URL}/v3/config/paths/patch/${input.name}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        },
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error);
      }

      // Update in database
      await ctx.db
        .update(paths)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(paths.name, input.name));

      revalidatePath("/");
      return { success: true };
    } catch (error) {
      throw error;
    }
  }),
});
