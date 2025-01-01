"use client";

import BaseTimeAgo from "react-timeago";

export function TimeAgo({ date }: { date: Date }) {
  return <BaseTimeAgo className="truncate" date={date} />;
}
