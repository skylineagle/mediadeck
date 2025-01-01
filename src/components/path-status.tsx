"use client";

import { motion } from "motion/react";

type StatusType = "live" | "ready";

interface PathStatusProps {
  status: StatusType;
}

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
};

export const PathStatus: React.FC<PathStatusProps> = ({ status }) => {
  const config = iconConfig[status];

  return (
    <div
      className={`flex items-center space-x-1 ${config.bgColor} h-6 w-16 rounded-full px-2 py-1`}
    >
      <motion.div
        className={`h-2 w-2 ${config.dotColor} rounded-full`}
        animate={config.animation}
        transition={{
          duration: status === "live" ? 1.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <span className="text-xs font-semibold text-white">{config.text}</span>
    </div>
  );
};
