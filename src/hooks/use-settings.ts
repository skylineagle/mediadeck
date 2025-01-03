import { useLocalStorage } from "./use-local-storage";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage("app-settings", {
    mediaMtxUrl: "http://localhost:9997",
    refreshInterval: 5000,
  });

  return { settings, setSettings };
}
