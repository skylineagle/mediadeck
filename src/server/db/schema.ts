// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  jsonb,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const paths = pgTable("paths", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Basic Settings
  name: text("name").notNull(),
  source: text("source"),
  sourceFingerprint: text("source_fingerprint"),
  sourceOnDemand: boolean("source_on_demand"),
  sourceOnDemandStartTimeout: text("source_on_demand_start_timeout"),
  sourceOnDemandCloseAfter: text("source_on_demand_close_after"),
  maxReaders: integer("max_readers"),
  srtReadPassphrase: text("srt_read_passphrase"),
  fallback: text("fallback"),

  // Recording Settings
  record: boolean("record"),
  recordPath: text("record_path"),
  recordFormat: text("record_format"),
  recordPartDuration: text("record_part_duration"),
  recordSegmentDuration: text("record_segment_duration"),
  recordDeleteAfter: text("record_delete_after"),

  // Publisher Settings
  overridePublisher: boolean("override_publisher"),
  srtPublishPassphrase: text("srt_publish_passphrase"),

  // RTSP Settings
  rtspTransport: text("rtsp_transport"),
  rtspAnyPort: boolean("rtsp_any_port"),
  rtspRangeType: text("rtsp_range_type"),
  rtspRangeStart: text("rtsp_range_start"),
  sourceRedirect: text("source_redirect"),

  // RPi Camera Settings
  rpiCameraCamID: integer("rpi_camera_cam_id"),
  rpiCameraWidth: integer("rpi_camera_width"),
  rpiCameraHeight: integer("rpi_camera_height"),
  rpiCameraHFlip: boolean("rpi_camera_h_flip"),
  rpiCameraVFlip: boolean("rpi_camera_v_flip"),
  rpiCameraBrightness: integer("rpi_camera_brightness"),
  rpiCameraContrast: integer("rpi_camera_contrast"),
  rpiCameraSaturation: integer("rpi_camera_saturation"),
  rpiCameraSharpness: integer("rpi_camera_sharpness"),
  rpiCameraExposure: text("rpi_camera_exposure"),
  rpiCameraAWB: text("rpi_camera_awb"),
  rpiCameraAWBGains: integer("rpi_camera_awb_gains").array(),
  rpiCameraDenoise: text("rpi_camera_denoise"),
  rpiCameraShutter: integer("rpi_camera_shutter"),
  rpiCameraMetering: text("rpi_camera_metering"),
  rpiCameraGain: integer("rpi_camera_gain"),
  rpiCameraEV: integer("rpi_camera_ev"),
  rpiCameraROI: text("rpi_camera_roi"),
  rpiCameraHDR: boolean("rpi_camera_hdr"),
  rpiCameraTuningFile: text("rpi_camera_tuning_file"),
  rpiCameraMode: text("rpi_camera_mode"),
  rpiCameraFPS: integer("rpi_camera_fps"),
  rpiCameraAfMode: text("rpi_camera_af_mode"),
  rpiCameraAfRange: text("rpi_camera_af_range"),
  rpiCameraAfSpeed: text("rpi_camera_af_speed"),
  rpiCameraLensPosition: integer("rpi_camera_lens_position"),
  rpiCameraAfWindow: text("rpi_camera_af_window"),
  rpiCameraFlickerPeriod: integer("rpi_camera_flicker_period"),
  rpiCameraTextOverlayEnable: boolean("rpi_camera_text_overlay_enable"),
  rpiCameraTextOverlay: text("rpi_camera_text_overlay"),
  rpiCameraCodec: text("rpi_camera_codec"),
  rpiCameraIDRPeriod: integer("rpi_camera_idr_period"),
  rpiCameraBitrate: integer("rpi_camera_bitrate"),
  rpiCameraProfile: text("rpi_camera_profile"),
  rpiCameraLevel: text("rpi_camera_level"),

  // Hooks
  runOnInit: text("run_on_init"),
  runOnInitRestart: boolean("run_on_init_restart"),
  runOnDemand: text("run_on_demand"),
  runOnDemandRestart: boolean("run_on_demand_restart"),
  runOnDemandStartTimeout: text("run_on_demand_start_timeout"),
  runOnDemandCloseAfter: text("run_on_demand_close_after"),
  runOnUnDemand: text("run_on_undemand"),
  runOnReady: text("run_on_ready"),
  runOnReadyRestart: boolean("run_on_ready_restart"),
  runOnNotReady: text("run_on_not_ready"),
  runOnRead: text("run_on_read"),
  runOnReadRestart: boolean("run_on_read_restart"),
  runOnUnread: text("run_on_unread"),
  runOnRecordSegmentCreate: text("run_on_record_segment_create"),
  runOnRecordSegmentComplete: text("run_on_record_segment_complete"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
