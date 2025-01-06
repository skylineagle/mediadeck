import { env } from "@/env";
import { parseAsString, useQueryState } from "nuqs";

export function useMediaMtxUrl() {
  const [mtxUrl, setMtxUrl] = useQueryState(
    "mtx-url",
    parseAsString.withDefault(env.NEXT_PUBLIC_MEDIAMTX_API_URL),
  );

  return { mtxUrl, setMtxUrl };
}
