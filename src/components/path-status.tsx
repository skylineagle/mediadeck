"use client";

import type { Path } from "@/lib/types";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";

type StatusType = "live" | "ready" | "streaming" | "unknown";

const iconConfig = {
  live: {
    bgColor: "bg-red-500",
    dotColor: "bg-white",
    text: "LIVE",
    animation: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
    },
  },
  ready: {
    bgColor: "bg-yellow-500",
    dotColor: "bg-white",
    text: "READY",
    animation: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.9, 1],
    },
  },
  streaming: {
    bgColor: "bg-green-500",
    dotColor: "bg-white",
    text: "STREAMING",
    animation: {
      x: ["-100%", "100%"],
      opacity: [0, 1, 0],
    },
  },
  unknown: {
    bgColor: "bg-gray-500",
    dotColor: "bg-white",
    text: "Unkown",
    animation: {},
  },
};

interface LiveIconProps {
  path: string;
}

function getPathState(pathState: Path): StatusType {
  if (pathState?.readers?.length && pathState.readers.length > 0) {
    return "streaming";
  }

  return "live";
}

export const PathStatus: React.FC<LiveIconProps> = ({ path }) => {
  const { data: pathState } = api.path.getPathState.useQuery(
    { name: path },
    { throwOnError: false },
  );

  if (!pathState) {
    return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
  }

  const status = getPathState(pathState);
  const config = iconConfig[status];

  return (
    <div
      className={`flex size-fit items-center space-x-1 ${config.bgColor} rounded-full px-1.5 py-1`}
    >
      {status === "unknown" ? (
        <div className={`h-2 w-2 ${config.dotColor} rounded-full`} />
      ) : status === "streaming" ? (
        <div className="h-2 w-6 overflow-hidden px-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`h-2 w-2 ${config.dotColor} rounded-full`}
              animate={config.animation}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          className={`h-2 w-2 ${config.dotColor} rounded-full`}
          animate={config.animation}
          transition={{
            duration: status === "live" ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      <span className="text-xs font-semibold text-white">{config.text}</span>
    </div>
  );
};
