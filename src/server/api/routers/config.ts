import { env } from "@/env";
import type { Config } from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { config } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ky from "ky";
import { z } from "zod";

const configSchema = z.object({
  // API Configuration
  api: z.boolean(),
  apiAddress: z.string(),
  apiEncryption: z.boolean(),
  apiServerKey: z.string().optional(),
  apiServerCert: z.string().optional(),
  apiAllowOrigin: z.string(),
  apiTrustedProxies: z.array(z.string()),

  // Metrics Configuration
  metrics: z.boolean(),
  metricsAddress: z.string(),
  metricsEncryption: z.boolean(),
  metricsServerKey: z.string().optional(),
  metricsServerCert: z.string().optional(),
  metricsAllowOrigin: z.string(),
  metricsTrustedProxies: z.array(z.string()),

  // pprof Configuration
  pprof: z.boolean(),
  pprofAddress: z.string(),
  pprofEncryption: z.boolean(),
  pprofServerKey: z.string().optional(),
  pprofServerCert: z.string().optional(),
  pprofAllowOrigin: z.string(),
  pprofTrustedProxies: z.array(z.string()),

  // Playback Configuration
  playback: z.boolean(),
  playbackAddress: z.string(),
  playbackEncryption: z.boolean(),
  playbackServerKey: z.string().optional(),
  playbackServerCert: z.string().optional(),
  playbackAllowOrigin: z.string(),
  playbackTrustedProxies: z.array(z.string()),

  // RTSP Configuration
  rtsp: z.boolean(),
  rtspAddress: z.string(),
  protocols: z.array(z.string()),
  encryption: z.string(),
  rtspAddress1935: z.boolean(),
  rtspsAddress: z.string(),
  rtpAddress: z.string(),
  rtcpAddress: z.string(),
  multicastIPRange: z.string(),
  multicastRTPPort: z.number(),
  multicastRTCPPort: z.number(),
  serverKey: z.string().optional(),
  serverCert: z.string().optional(),
  authMethods: z.array(z.string()),
  rtspEncryption: z.string(),
  rtspServerKey: z.string().optional(),
  rtspServerCert: z.string().optional(),
  rtspAuthMethods: z.array(z.string()),

  // RTMP Configuration
  rtmp: z.boolean(),
  rtmpAddress: z.string(),
  rtmpEncryption: z.string(),
  rtmpsAddress: z.string(),
  rtmpServerKey: z.string().optional(),
  rtmpServerCert: z.string().optional(),

  // HLS Configuration
  hls: z.boolean(),
  hlsAddress: z.string(),
  hlsEncryption: z.boolean(),
  hlsServerKey: z.string().optional(),
  hlsServerCert: z.string().optional(),
  hlsAllowOrigin: z.string(),
  hlsAlwaysRemux: z.boolean(),
  hlsVariant: z.string(),
  hlsSegmentCount: z.number(),
  hlsSegmentDuration: z.string(),
  hlsPartDuration: z.string(),
  hlsSegmentMaxSize: z.string(),
  hlsAllowOriginString: z.string(),
  hlsTrustedProxies: z.array(z.string()),

  // WebRTC Configuration
  webrtc: z.boolean(),
  webrtcAddress: z.string(),
  webrtcEncryption: z.boolean(),
  webrtcServerKey: z.string().optional(),
  webrtcServerCert: z.string().optional(),
  webrtcAllowOrigin: z.string(),
  webrtcTrustedProxies: z.array(z.string()),
  webrtcICEServers: z.array(z.string()),
  webrtcICEHostNAT1To1IPs: z.array(z.string()),
  webrtcICEUDPMuxAddress: z.string(),
  webrtcICETCPMuxAddress: z.string(),

  // SRT Configuration
  srt: z.boolean(),
  srtAddress: z.string(),

  // Log Configuration
  logLevel: z.string(),
  logDestinations: z.array(z.string()),
  logFile: z.string(),
});

export const configRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    // Get MediaMTX config
    const mtxConfig = await ky
      .get<Config>(`${env.MEDIAMTX_API_URL}/v3/config/global/get`)
      .json();

    // Get DB config
    const dbConfig = await ctx.db.query.config.findFirst();

    return {
      mtxConfig,
      dbConfig: dbConfig?.config as Config | null,
    };
  }),

  update: publicProcedure
    .input(z.object(configSchema.partial().shape))
    .mutation(async ({ ctx, input }) => {
      await ky.patch(`${env.MEDIAMTX_API_URL}/v3/config/global/patch`, {
        json: input,
      });

      // Update DB
      const existingConfig = await ctx.db.query.config.findFirst();

      if (existingConfig) {
        await ctx.db
          .update(config)
          .set({
            config: { ...(existingConfig?.config as Config), ...input },
            updatedAt: new Date(),
          })
          .where(eq(config.id, existingConfig.id));
      } else {
        await ctx.db.insert(config).values({
          config: input,
        });
      }

      return { success: true };
    }),

  sync: publicProcedure
    .input(
      z.object({
        source: z.enum(["mtx", "db"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { source } = input;

      if (source === "mtx") {
        // Get MediaMTX config and save to DB
        const mtxConfig = await ky
          .get<Config>(`${env.MEDIAMTX_API_URL}/v3/config/global/get`)
          .json();

        const existingConfig = await ctx.db.query.config.findFirst();

        if (existingConfig) {
          await ctx.db
            .update(config)
            .set({ config: mtxConfig, updatedAt: new Date() })
            .where(eq(config.id, existingConfig.id));
        } else {
          await ctx.db.insert(config).values({
            config: mtxConfig,
          });
        }
      } else {
        // Get DB config and update MediaMTX
        const dbConfig = await ctx.db.query.config.findFirst();

        if (!dbConfig) {
          throw new Error("No configuration found in database");
        }

        await ky.patch(`${env.MEDIAMTX_API_URL}/v3/config/global/patch`, {
          json: dbConfig.config,
        });
      }

      return { success: true };
    }),
});
