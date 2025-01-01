import type { paths, components } from "@/lib/mediamtx-api.d.ts";

export type PathsConfigsResponse =
  paths["/v3/config/paths/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type PathConfig = components["schemas"]["PathConf"];

export type PathsResponse =
  paths["/v3/paths/list"]["get"]["responses"]["200"]["content"]["application/json"];

export type PathResponse =
  paths["/v3/paths/get/{name}"]["get"]["responses"]["200"]["content"]["application/json"];

export type Path = components["schemas"]["Path"];
export type PathReader = components["schemas"]["PathReader"];

export type AddPathRequest =
  paths["/v3/config/paths/add/{name}"]["post"]["requestBody"]["content"]["application/json"];
export type AddPathResponse =
  paths["/v3/config/paths/add/{name}"]["post"]["responses"];

export type RtspSessionResponse =
  paths["/v3/rtspsessions/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type RtspSession = components["schemas"]["RTSPSession"];

export type RtmpSessionResponse =
  paths["/v3/rtmpconns/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type RtmpSession = components["schemas"]["RTMPConn"];

export type WebRtcSessionResponse =
  paths["/v3/webrtcsessions/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type WebRtcSession = components["schemas"]["WebRTCSession"];

export type HlsSessionResponse =
  paths["/v3/hlsmuxers/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type HlsSession = components["schemas"]["HLSMuxer"];

export type SrtSessionResponse =
  paths["/v3/srtconns/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type SrtSession = components["schemas"]["SRTConn"];
