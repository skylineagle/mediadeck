import type { paths } from "./mediamtx-api";

export type PathsConfigsResponse =
  paths["/v3/config/paths/list"]["get"]["responses"];
export type PathsConfigs =
  PathsConfigsResponse["200"]["content"]["application/json"];

export type PathsResponse = paths["/v3/paths/list"]["get"];
export type Paths =
  PathsResponse["responses"]["200"]["content"]["application/json"];

export type SessionResponse =
  paths["/v3/rtspsessions/list"]["get"]["responses"]["200"]["content"]["application/json"];
export type Session = SessionResponse["items"];

export type AddPathRequest =
  paths["/v3/config/paths/add/{name}"]["post"]["requestBody"]["content"]["application/json"];
export type AddPathResponse =
  paths["/v3/config/paths/add/{name}"]["post"]["responses"];
