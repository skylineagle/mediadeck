import { pathSchema } from "@/lib/schemas/config.schema";
import type { Path, PathConfig } from "@/lib/types";
import { withMtxUrl } from "@/lib/validators";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paths } from "@/server/db/schema";
import type { EnhancedPath } from "@/types";
import { eq } from "drizzle-orm";
import ky, { HTTPError } from "ky";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPathConfigs, listActivePaths, parseDbPaths } from "./utils";

export const pathRouter = createTRPCRouter({
  getAllPaths: publicProcedure
    .input(withMtxUrl)
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.paths.findMany({
        orderBy: (paths, { asc }) => [asc(paths.name)],
      });

      const dbPaths = parseDbPaths(result);
      const pathConfigs = await getPathConfigs(input.mtxUrl);
      const activePaths = await listActivePaths(input.mtxUrl);

      const enhancedPaths: EnhancedPath[] = [
        ...activePaths.map((path) => ({
          ...(pathConfigs.find((p) => p.name === path.name) ?? path),
          status: {
            isInDb: dbPaths.some((p) => p.name === path.name),
            isActive: true,
          },
        })),
        ...dbPaths
          .filter((path) => !activePaths.some((ap) => ap.name === path.name))
          .map((path) => ({
            ...path,
            status: {
              isInDb: true,
              isActive: false,
            },
          })),
      ];

      console.log(pathConfigs.find((path) => path.name === "recorded"));
      console.log(enhancedPaths.find((path) => path.name === "recorded"));

      return enhancedPaths;
    }),

  create: publicProcedure
    .input(z.object({ data: pathSchema, mediamtx: withMtxUrl }))
    .mutation(async ({ ctx, input }) => {
      const { data, mediamtx } = input;
      try {
        // Add to Media MTX
        await ky
          .post(`${mediamtx.mtxUrl}/v3/config/paths/add/${data.name}`, {
            json: data,
          })
          .json();
        // Add to database with boolean to string conversion

        // Get the created path from MediaMTX to ensure we have the latest data
        const createdPath = await ky
          .get<PathConfig>(
            `${mediamtx.mtxUrl}/v3/config/paths/get/${data.name}`,
          )
          .json();

        if (!createdPath)
          throw new Error("Failed to get created path from MediaMTX");

        await ctx.db.insert(paths).values({
          ...createdPath,
          name: data.name,
        });

        revalidatePath("/");
        return { success: true };
      } catch (error) {
        console.error("Error creating path:", error);
        throw error;
      }
    }),

  sync: publicProcedure.input(pathSchema).mutation(async ({ ctx, input }) => {
    // Add to database
    await ctx.db.insert(paths).values({
      ...input,
    });
    revalidatePath("/");
  }),

  remove: publicProcedure
    .input(z.object({ name: z.string() }).merge(withMtxUrl))
    .mutation(async ({ ctx, input }) => {
      const { mtxUrl, name } = input;
      // Remove from MediaMTX
      // Get path data from database
      const pathData = await ctx.db.query.paths.findFirst({
        where: eq(paths.name, name),
      });

      if (!pathData) throw new Error("Path not found");

      // Check if path exists on MediaMTX
      try {
        const response = await ky.get(`${mtxUrl}/v3/config/paths/get/${name}`);

        if (response.status === 200) {
          await ky.delete(`${mtxUrl}/v3/config/paths/delete/${name}`);
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
    .input(
      z.object({ name: z.string(), enabled: z.boolean() }).merge(withMtxUrl),
    )
    .mutation(async ({ ctx, input }) => {
      const { mtxUrl, name, enabled } = input;
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
          `${mtxUrl}/v3/config/paths/add/${info.name}`,
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
          `${mtxUrl}/v3/config/paths/delete/${name}`,
        );

        if (!response.ok) {
          throw new Error("Failed to remove path from MediaMTX");
        }
      }

      revalidatePath("/");
      return { success: true };
    }),

  listPublishers: publicProcedure.input(withMtxUrl).query(async ({ input }) => {
    const paths = await ky.get<Path[]>(`${input.mtxUrl}/v3/paths/list`).json();

    const publisherPaths = paths?.filter((path) => {
      if (!path.source) return false;
      return [
        "rtmpConn",
        "rtspSession",
        "rtspsSession",
        "srtConn",
        "webRTCSession",
      ].includes(path.source.type ?? "");
    });

    return publisherPaths;
  }),

  getPathState: publicProcedure
    .input(z.object({ name: z.string() }).merge(withMtxUrl))
    .query(async ({ input }) => {
      const { mtxUrl, name } = input;
      try {
        const path = await ky
          .get<Path>(`${mtxUrl}/v3/paths/get/${name}`)
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

  healthcheck: publicProcedure.input(withMtxUrl).query(async ({ input }) => {
    try {
      await ky.get(`${input.mtxUrl}/v3/paths/list`).json();
      return { isConnected: true };
    } catch (error) {
      console.log(error);
      return { isConnected: false };
    }
  }),
});
