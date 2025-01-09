import type { PathsConfigsResponse, PathsResponse } from "@/lib/types";
import type { Path } from "@/server/db/types";
import type { CombinedPath } from "@/types";
import ky from "ky";

export function parseDbPaths(paths: Path[]): CombinedPath[] {
  return paths.map((path) => ({
    name: path.name ?? "",
    source: { type: path.source ?? null },
    record: path.record ?? false,
    isActive: false,
  }));
}

export async function getPathConfigs(mtxUrl: string) {
  const response = await ky
    .get<PathsConfigsResponse>(`${mtxUrl}/v3/config/paths/list`)
    .json();

  const relevantPaths =
    response?.items?.filter((path) => path.name !== "all_others") ?? [];

  return relevantPaths.map((path) => ({
    name: path.name ?? "",
    source: { type: path.source ?? null },
    record: path.record ?? false,
    isActive: false,
  }));
}

export async function listActivePaths(mtxUrl: string) {
  const response = await ky
    .get<PathsResponse>(`${mtxUrl}/v3/paths/list`)
    .json();

  const relevantPaths =
    response?.items?.filter((path) => path.name !== "all_others") ?? [];

  return relevantPaths.map((path) => ({
    name: path.name ?? "",
    source: { type: null },
    record: false,
    isActive: true,
  }));
}
