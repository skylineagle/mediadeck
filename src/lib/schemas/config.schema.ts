import { z } from "zod";

export const pathSchema = z.object({
  // Basic Settings
  name: z.string().min(1, "Name is required"),
  source: z.string().optional(),
  sourceFingerprint: z.string().optional(),
  sourceOnDemand: z.boolean().optional(),
  sourceOnDemandStartTimeout: z.string().optional(),
  sourceOnDemandCloseAfter: z.string().optional(),
  maxReaders: z.number().optional(),
  fallback: z.string().optional(),

  // Recording Settings
  record: z.boolean().optional(),
  recordPath: z.string().optional(),
  recordFormat: z.string().optional(),
  recordPartDuration: z.string().optional(),
  recordSegmentDuration: z.string().optional(),
  recordDeleteAfter: z.string().optional(),

  // Publisher Settings
  overridePublisher: z.boolean().optional(),
  srtPublishPassphrase: z.string().optional(),
  srtReadPassphrase: z.string().optional(),

  // RTSP Settings
  rtspTransport: z.string().optional(),
  rtspAnyPort: z.boolean().optional(),
  rtspRangeType: z.string().optional(),
  rtspRangeStart: z.string().optional(),
  sourceRedirect: z.string().optional(),

  // RPi Camera Settings
  rpiCameraCamID: z.number().optional(),
  rpiCameraWidth: z.number().optional(),
  rpiCameraHeight: z.number().optional(),
  rpiCameraHFlip: z.boolean().optional(),
  rpiCameraVFlip: z.boolean().optional(),
  rpiCameraBrightness: z.number().optional(),
  rpiCameraContrast: z.number().optional(),
  rpiCameraSaturation: z.number().optional(),
  rpiCameraSharpness: z.number().optional(),
  rpiCameraExposure: z.string().optional(),
  rpiCameraAWB: z.string().optional(),
  rpiCameraAWBGains: z.array(z.number()).optional(),
  rpiCameraDenoise: z.string().optional(),
  rpiCameraShutter: z.number().optional(),
  rpiCameraMetering: z.string().optional(),
  rpiCameraGain: z.number().optional(),
  rpiCameraEV: z.number().optional(),
  rpiCameraROI: z.string().optional(),
  rpiCameraHDR: z.boolean().optional(),
  rpiCameraTuningFile: z.string().optional(),
  rpiCameraMode: z.string().optional(),
  rpiCameraFPS: z.number().optional(),
  rpiCameraAfMode: z.string().optional(),
  rpiCameraAfRange: z.string().optional(),
  rpiCameraAfSpeed: z.string().optional(),
  rpiCameraLensPosition: z.number().optional(),
  rpiCameraAfWindow: z.string().optional(),
  rpiCameraFlickerPeriod: z.number().optional(),
  rpiCameraTextOverlayEnable: z.boolean().optional(),
  rpiCameraTextOverlay: z.string().optional(),
  rpiCameraCodec: z.string().optional(),
  rpiCameraIDRPeriod: z.number().optional(),
  rpiCameraBitrate: z.number().optional(),
  rpiCameraProfile: z.string().optional(),
  rpiCameraLevel: z.string().optional(),

  // Hooks
  runOnInit: z.string().optional(),
  runOnInitRestart: z.boolean().optional(),
  runOnDemand: z.string().optional(),
  runOnDemandRestart: z.boolean().optional(),
  runOnDemandStartTimeout: z.string().optional(),
  runOnDemandCloseAfter: z.string().optional(),
  runOnUnDemand: z.string().optional(),
  runOnReady: z.string().optional(),
  runOnReadyRestart: z.boolean().optional(),
  runOnNotReady: z.string().optional(),
  runOnRead: z.string().optional(),
  runOnReadRestart: z.boolean().optional(),
  runOnUnread: z.string().optional(),
  runOnRecordSegmentCreate: z.string().optional(),
  runOnRecordSegmentComplete: z.string().optional(),
});

export type Path = z.infer<typeof pathSchema>;

export const configSchema = z.object({
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
});

export type ConfigFormData = z.infer<typeof configSchema>;
