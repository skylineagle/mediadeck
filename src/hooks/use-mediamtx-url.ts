import { useSettings } from "./use-settings";

export function useMediaMtxUrl() {
  const { settings, setSettings } = useSettings();

  return {
    mtxUrl: settings.mediaMtxUrl,
    setMtxUrl: (value: string) =>
      setSettings({ ...settings, mediaMtxUrl: value }),
  };
}
