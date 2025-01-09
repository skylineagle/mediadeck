"use client";

import { Input } from "@/components/ui/input";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@radix-ui/react-label";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-xs text-muted-foreground">
          Configure your application settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="mtx-url">MediaMTX URL</Label>
          <Input
            id="mtx-url"
            placeholder="http://localhost:9997"
            value={settings.mediaMtxUrl}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, mediaMtxUrl: e.target.value }))
            }
          />
          <Label className="text-xs text-muted-foreground">
            The URL of your MediaMTX server
          </Label>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="refresh-interval">Refresh Interval (ms)</Label>
          <Input
            id="refresh-interval"
            type="number"
            placeholder="5000"
            value={settings.refreshInterval}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                refreshInterval: parseInt(e.target.value),
              }))
            }
          />
          <Label className="text-xs text-muted-foreground">
            How often to refresh the session data (in milliseconds)
          </Label>
        </div>

        {/* <Button type="submit">Save Settings</Button> */}
      </div>
    </div>
  );
}
