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
