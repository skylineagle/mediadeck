// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const paths = pgTable("paths", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  source: text("source"),
  sourceProtocol: text("source_protocol"),
  sourceOnDemand: text("source_on_demand"),
  sourceOnDemandStartTimeout: text("source_on_demand_start_timeout"),
  sourceOnDemandCloseAfter: text("source_on_demand_close_after"),
  sourceRedirect: text("source_redirect"),
  fallback: text("fallback"),
  record: text("record"),
  recordPath: text("record_path"),
  recordFormat: text("record_format"),
  recordPartDuration: text("record_part_duration"),
  recordSegmentDuration: text("record_segment_duration"),
  recordDeleteAfter: text("record_delete_after"),
  publishUser: text("publish_user"),
  publishPass: text("publish_pass"),
  publishIPs: text("publish_ips"),
  readUser: text("read_user"),
  readPass: text("read_pass"),
  readIPs: text("read_ips"),
  runOnInit: text("run_on_init"),
  runOnInitRestart: text("run_on_init_restart"),
  runOnDemand: text("run_on_demand"),
  runOnDemandRestart: text("run_on_demand_restart"),
  runOnDemandStartTimeout: text("run_on_demand_start_timeout"),
  runOnDemandCloseAfter: text("run_on_demand_close_after"),
  runOnReady: text("run_on_ready"),
  runOnReadyRestart: text("run_on_ready_restart"),
  runOnRead: text("run_on_read"),
  runOnReadRestart: text("run_on_read_restart"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const config = pgTable("config", {
  id: uuid("id").primaryKey().defaultRandom(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
