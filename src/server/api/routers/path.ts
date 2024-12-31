import { Paths, PathsConfigs } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { paths } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ky from "ky";
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
  enabled: z.boolean().optional(),
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
      const response = await ky
        .post(`http://localhost:9997/v3/config/paths/add/${input.name}`, {
          json: input,
        })
        .json();

      // Add to database
      await ctx.db.insert(paths).values({
        ...input,
        enabled: true,
      });

      revalidatePath("/dashboard");
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
        enabled: true,
      });
      revalidatePath("/dashboard");
    }),

  remove: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Remove from MediaMTX
        // Get path data from database
        const pathData = await ctx.db.query.paths.findFirst({
          where: eq(paths.name, input.name),
        });

        if (!pathData) throw new Error("Path not found");

        if (pathData.enabled) {
          await ky.delete(
            `http://localhost:9997/v3/config/paths/delete/${input.name}`,
          );
        }

        // Remove from database
        await ctx.db.delete(paths).where(eq(paths.name, input.name));

        revalidatePath("/dashboard");
        return { success: true };
      } catch (error) {
        console.error("Error removing path:", error);
        throw error;
      }
    }),

  toggle: publicProcedure
    .input(z.object({ name: z.string(), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // Update database
      await ctx.db
        .update(paths)
        .set({ enabled: input.enabled })
        .where(eq(paths.name, input.name));

      // Update MediaMTX
      if (input.enabled) {
        // Get path data from database
        const pathData = await ctx.db.query.paths.findFirst({
          where: eq(paths.name, input.name),
        });

        if (!pathData) throw new Error("Path not found");

        // Add to MediaMTX
        const response = await ky.post(
          `http://localhost:9997/v3/config/paths/add/${input.name}`,
          {
            json: {
              source: pathData.source,
              sourceOnDemand: pathData.sourceOnDemand,
              sourceOnDemandStartTimeout: pathData.sourceOnDemandStartTimeout,
              sourceOnDemandCloseAfter: pathData.sourceOnDemandCloseAfter,
              fallback: pathData.fallback,
              record: pathData.record,
              recordPath: pathData.recordPath,
              recordFormat: pathData.recordFormat,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to add path to MediaMTX");
        }
      } else {
        // Remove from MediaMTX
        const response = await ky.post(
          `http://localhost:9997/v3/config/paths/remove/${input.name}`,
        );

        if (!response.ok) {
          throw new Error("Failed to remove path from MediaMTX");
        }
      }

      return { success: true };
    }),

  listPaths: publicProcedure.query(async () => {
    const response = await ky
      .get<PathsConfigs>("http://localhost:9997/v3/config/paths/list")
      .json();
    
    return response.items ?? [];
  }),
});
