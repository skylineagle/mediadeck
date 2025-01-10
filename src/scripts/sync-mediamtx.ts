import type { PathsConfigsResponse } from "@/lib/types";
import { db } from "@/server/db";
import { paths } from "@/server/db/schema";
import ky from "ky";

const MEDIAMTX_API = process.env.MEDIAMTX_URL!;

// Get the underlying postgres connection
const sql = db.$client;

async function waitForMediaMTX() {
  while (true) {
    try {
      const response = await fetch(`${MEDIAMTX_API}/v3/config/paths/list`);
      if (response.ok) {
        console.log("MediaMTX API is ready");
        return;
      }
    } catch {
      console.log("Waiting for MediaMTX API to be ready...");
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function syncPaths() {
  try {
    // Get all paths from database
    const dbPaths = await db.select().from(paths);

    // Get current paths from MediaMTX
    const response = await ky
      .get<PathsConfigsResponse>(`${MEDIAMTX_API}/v3/config/paths/list`)
      .json();

    const currentPaths = response.items;

    // Delete paths that are not in database
    for (const path of currentPaths ?? []) {
      // Skip the special 'all_others' path configuration
      if (path.name === "all_others") continue;

      if (!dbPaths.find((p) => p.name === path.name)) {
        await ky
          .delete(`${MEDIAMTX_API}/v3/config/paths/delete/${path.name}`, {
            json: path,
          })
          .json();
      }
    }

    // Add or update paths from database
    for (const path of dbPaths) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...data } = path;

      await ky
        .post(`${MEDIAMTX_API}/v3/config/paths/add/${path.name}`, {
          json: data,
        })
        .json();
    }

    console.log("Successfully synced paths with MediaMTX");
  } catch (error) {
    console.error("Failed to sync paths:", error);
  }
}

async function syncConfig() {
  try {
    // Get config from database
    const dbConfig = await db.query.config.findFirst();
    if (!dbConfig) {
      console.log("No config found in database, skipping sync");
      return;
    }

    console.log("Updating MediaMTX config...");
    const { config } = dbConfig;

    // Update MediaMTX config
    const response = await ky
      .patch(`${MEDIAMTX_API}/v3/config/global/patch`, {
        json: config,
        timeout: 10000, // 10 second timeout
      })
      .json();

    console.log("Successfully synced config with MediaMTX:", response);
  } catch (error) {
    console.error("Failed to sync config with MediaMTX:", error);
    throw error; // Re-throw to trigger the main error handler
  }
}

async function main() {
  try {
    // Wait for MediaMTX to be ready before starting sync
    await waitForMediaMTX();
    console.log("Starting initial sync");
    await syncConfig();
    await syncPaths();
    console.log("Initial sync completed");
  } finally {
    // Properly end the postgres connection
    await sql.end();
  }
}

main()
  .then(() => {
    console.log("Sync completed");
  })
  .catch((error) => {
    console.error("Sync failed:", error);
  });
