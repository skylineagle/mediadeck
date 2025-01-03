import type { Path, PathsConfigsResponse, PathsResponse } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paths } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ky, { HTTPError } from "ky";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const pathSchema = z.object({
  name: z.string().min(1, "Name is required"),
  source: z.string().optional(),
  sourceOnDemand: z.boolean().optional(),
  sourceOnDemandStartTimeout: z.string().optional(),
  sourceOnDemandCloseAfter: z.string().optional(),
  fallback: z.string().optional(),
  record: z.boolean().optional(),
  recordPath: z.string().optional(),
  recordFormat: z.string().optional(),
});

export const pathRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.paths.findMany({
      orderBy: (paths, { asc }) => [asc(paths.name)],
    });
  }),

  create: publicProcedure.input(pathSchema).mutation(async ({ ctx, input }) => {
    try {
      // Add to Media MTX
      await ky
        .post(`http://localhost:9997/v3/config/paths/add/${input.name}`, {
          json: input,
        })
        .json();

      // Add to database
      await ctx.db.insert(paths).values({
        ...input,
      });

      revalidatePath("/");
      return { success: true };
    } catch (error) {
      console.error("Error creating path:", error);
      throw error;
    }
  }),

  sync: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Add to database
      await ctx.db.insert(paths).values({
        ...input,
      });
      revalidatePath("/");
    }),

  remove: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Remove from MediaMTX
      // Get path data from database
      const pathData = await ctx.db.query.paths.findFirst({
        where: eq(paths.name, input.name),
      });

      if (!pathData) throw new Error("Path not found");

      // Check if path exists on MediaMTX

      try {
        const response = await ky.get(
          `http://localhost:9997/v3/config/paths/get/${input.name}`,
        );

        if (response.status === 200) {
          await ky.delete(
            `http://localhost:9997/v3/config/paths/delete/${input.name}`,
          );
        }
      } catch (error) {
        if (!(error instanceof HTTPError && error.response.status === 404)) {
          throw error;
        }
      }

      // Remove from database
      await ctx.db.delete(paths).where(eq(paths.name, input.name));

      revalidatePath("/");
      return { success: true };
    }),

  toggle: publicProcedure
    .input(z.object({ name: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // Update MediaMTX
      if (input.enabled) {
        // Get path data from database
        const pathData = await ctx.db.query.paths.findFirst({
          where: eq(paths.name, input.name),
        });

        if (!pathData) throw new Error("Path not found");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, id, ...info } = pathData;
        console.log(info);

        // Add to MediaMTX
        const response = await ky.post(
          `http://localhost:9997/v3/config/paths/add/${info.name}`,
          {
            json: info,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to add path to MediaMTX");
        }
      } else {
        // Remove from MediaMTX
        const response = await ky.delete(
          `http://localhost:9997/v3/config/paths/delete/${input.name}`,
        );

        if (!response.ok) {
          throw new Error("Failed to remove path from MediaMTX");
        }
      }

      revalidatePath("/");
      return { success: true };
    }),

  listPathsConfigs: publicProcedure.query(async () => {
    const response = await ky
      .get<PathsConfigsResponse>("http://localhost:9997/v3/config/paths/list")
      .json();

    return response?.items?.filter((path) => path.name !== "all_others") ?? [];
  }),

  listPaths: publicProcedure.query(async () => {
    const response = await ky
      .get<PathsResponse>("http://localhost:9997/v3/paths/list")
      .json();

    return response?.items?.filter((path) => path.name !== "all_others") ?? [];
  }),

  listPublishers: publicProcedure.query(async () => {
    const paths = await ky
      .get<Path[]>(`${process.env.NEXT_PUBLIC_MEDIAMTX_API_URL}/v3/paths/list`)
      .json();

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
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      try {
        const path = await ky
          .get<Path>(`http://localhost:9997/v3/paths/get/${input.name}`)
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
});
