import type { paths, components } from "@/lib/mediamtx-api.d.ts";

export type PathConfig = components["schemas"]["PathConf"];
export type PathsConfigsResponse = components["schemas"]["PathConfList"];
export type Path = components["schemas"]["Path"];
export type PathList = components["schemas"]["PathList"];
export type PathSource = components["schemas"]["PathSource"];

export interface Config {
  // API Configuration
  api: boolean;
  apiAddress: string;
  apiEncryption: boolean;
  apiServerKey?: string;
  apiServerCert?: string;
  apiAllowOrigin: string;
  apiTrustedProxies: string[];

  // Metrics Configuration
  metrics: boolean;
  metricsAddress: string;
  metricsEncryption: boolean;
  metricsServerKey?: string;
  metricsServerCert?: string;
  metricsAllowOrigin: string;
  metricsTrustedProxies: string[];

  // pprof Configuration
  pprof: boolean;
  pprofAddress: string;
  pprofEncryption: boolean;
  pprofServerKey?: string;
  pprofServerCert?: string;
  pprofAllowOrigin: string;
  pprofTrustedProxies: string[];

  // Playback Configuration
  playback: boolean;
  playbackAddress: string;
  playbackEncryption: boolean;
  playbackServerKey?: string;
  playbackServerCert?: string;
  playbackAllowOrigin: string;
  playbackTrustedProxies: string[];

  // RTSP Configuration
  rtsp: boolean;
  rtspAddress: string;
  protocols: string[];
  encryption: string;
  rtspAddress1935: boolean;
  rtspsAddress: string;
  rtpAddress: string;
  rtcpAddress: string;
  multicastIPRange: string;
  multicastRTPPort: number;
  multicastRTCPPort: number;
  serverKey?: string;
  serverCert?: string;
  authMethods: string[];
  rtspEncryption: string;
  rtspServerKey?: string;
  rtspServerCert?: string;
  rtspAuthMethods: string[];

  // RTMP Configuration
  rtmp: boolean;
  rtmpAddress: string;
  rtmpEncryption: string;
  rtmpsAddress: string;
  rtmpServerKey?: string;
  rtmpServerCert?: string;

  // HLS Configuration
  hls: boolean;
  hlsAddress: string;
  hlsEncryption: boolean;
  hlsServerKey?: string;
  hlsServerCert?: string;
  hlsAllowOrigin: string;
  hlsAlwaysRemux: boolean;
  hlsVariant: string;
  hlsSegmentCount: number;
  hlsSegmentDuration: string;
  hlsPartDuration: string;
  hlsSegmentMaxSize: string;
  hlsAllowOriginString: string;
  hlsTrustedProxies: string[];

  // WebRTC Configuration
  webrtc: boolean;
  webrtcAddress: string;
  webrtcEncryption: boolean;
  webrtcServerKey?: string;
  webrtcServerCert?: string;
  webrtcAllowOrigin: string;
  webrtcTrustedProxies: string[];
  webrtcICEServers: string[];
  webrtcICEHostNAT1To1IPs: string[];
  webrtcICEUDPMuxAddress: string;
  webrtcICETCPMuxAddress: string;

  // SRT Configuration
  srt: boolean;
  srtAddress: string;

  // Log Configuration
  logLevel: string;
  logDestinations: string[];
  logFile: string;

  // Path Defaults
  paths: Record<string, PathConfig>;
}

export type PathsResponse =
  paths["/v3/paths/list"]["get"]["responses"]["200"]["content"]["application/json"];

export type PathResponse =
  paths["/v3/paths/get/{name}"]["get"]["responses"]["200"]["content"]["application/json"];

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
