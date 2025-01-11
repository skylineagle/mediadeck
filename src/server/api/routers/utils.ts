import { env } from "@/env";
import type { PathsConfigsResponse, PathsResponse } from "@/lib/types";
import type { Path } from "@/server/db/types";
import type { CombinedPath } from "@/types";
import ky from "ky";

export function parseDbPaths(paths: Path[]): CombinedPath[] {
  return paths.map((path) => ({
    name: path.name ?? "",
    source: { type: path.source ?? null },
    record: path.record ?? false,
  }));
}

export async function getPathConfigs(): Promise<CombinedPath[]> {
  const response = await ky
    .get<PathsConfigsResponse>(`${env.MEDIAMTX_API_URL}/v3/config/paths/list`)
    .json();

  const relevantPaths =
    response?.items?.filter((path) => path.name !== "all_others") ?? [];

  return relevantPaths.map((path) => ({
    name: path.name ?? "",
    source: { type: path.source ?? null },
    record: path.record ?? false,
  }));
}

export async function listActivePaths(): Promise<CombinedPath[]> {
  const response = await ky
    .get<PathsResponse>(`${env.MEDIAMTX_API_URL}/v3/paths/list`)
    .json();

  const relevantPaths =
    response?.items?.filter((path) => path.name !== "all_others") ?? [];

  return relevantPaths.map((path) => ({
    name: path.name ?? "",
    source: { type: null },
    record: false,
  }));
}
