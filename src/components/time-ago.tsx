"use client";

import { useState, useEffect } from "react";
import BaseTimeAgo from "react-timeago";

export function TimeAgo({ date }: { date: Date }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and before hydration, show a simple formatted date
  if (!isMounted) {
    return <span className="truncate">{date.toLocaleString()}</span>;
  }

  return <BaseTimeAgo className="truncate" date={date} />;
}
