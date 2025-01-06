"use client";

import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { useSettings } from "@/hooks/use-settings";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function MediaMtxStatus() {
  const { mtxUrl } = useMediaMtxUrl();
  const { settings } = useSettings();
  const { data } = api.path.healthcheck.useQuery(
    { mtxUrl },
    {
      refetchInterval: settings.refreshInterval,
    },
  );

  const isConnected = data?.isConnected ?? false;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
            <motion.div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              animate={{
                scale: isConnected ? [1, 1.5, 1] : 1,
                opacity: isConnected ? [1, 0.8, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="text-xs">
              {isConnected
                ? "Connected to MediaMTX"
                : "Disconnected from MediaMTX"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>MediaMTX Server Status</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
