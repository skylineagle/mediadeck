import { env } from "@/env";
import type {
  HlsSessionResponse,
  RtmpSessionResponse,
  RtspSessionResponse,
  SrtSessionResponse,
  WebRtcSessionResponse,
} from "@/lib/types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import ky from "ky";

export const sessionRouter = createTRPCRouter({
  listRtspSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<RtspSessionResponse>(`${env.MEDIAMTX_API_URL}/v3/rtspsessions/list`)
      .json();

    return response.items ?? [];
  }),

  listRtmpSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<RtmpSessionResponse>(`${env.MEDIAMTX_API_URL}/v3/rtmpconns/list`)
      .json();

    return response.items ?? [];
  }),

  listWebRtcSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<WebRtcSessionResponse>(
        `${env.MEDIAMTX_API_URL}/v3/webrtcsessions/list`,
      )
      .json();

    return response.items ?? [];
  }),

  listHlsSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<HlsSessionResponse>(`${env.MEDIAMTX_API_URL}/v3/hlsmuxers/list`)
      .json();

    return response.items ?? [];
  }),

  listSrtSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<SrtSessionResponse>(`${env.MEDIAMTX_API_URL}/v3/srtconns/list`)
      .json();

    return response.items ?? [];
  }),
});
