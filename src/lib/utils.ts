import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPathSynced(path: string, paths: { name: string }[]) {
  return paths.some((p) => p.name === path);
}
