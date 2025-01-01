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
      .get<RtspSessionResponse>("http://localhost:9997/v3/rtspsessions/list")
      .json();

    console.log(response);

    return response.items ?? [];
  }),

  listRtmpSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<RtmpSessionResponse>("http://localhost:9997/v3/rtmpconns/list")
      .json();

    console.log(response);

    return response.items ?? [];
  }),

  listWebRtcSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<WebRtcSessionResponse>(
        "http://localhost:9997/v3/webrtcsessions/list",
      )
      .json();

    console.log(response);

    return response.items ?? [];
  }),

  listHlsSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<HlsSessionResponse>("http://localhost:9997/v3/hlsmuxers/list")
      .json();

    console.log(response);

    return response.items ?? [];
  }),

  listSrtSessions: publicProcedure.query(async () => {
    const response = await ky
      .get<SrtSessionResponse>("http://localhost:9997/v3/srtconns/list")
      .json();

    console.log(response);

    return response.items ?? [];
  }),
});
