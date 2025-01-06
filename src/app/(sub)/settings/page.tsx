"use client";

import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "@radix-ui/react-label";
import { parseAsString, useQueryState } from "nuqs";

export default function SettingsPage() {
  const [mtxUrl, setMtxUrl] = useQueryState(
    "mtx-url",
    parseAsString.withDefault(env.NEXT_PUBLIC_MEDIAMTX_API_URL),
  );
  const { settings, setSettings } = useSettings();

  const handleUrlChange = (url: string) => {
    setMtxUrl(url);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-xs text-muted-foreground">
          Configure your application settings
        </p>
      </div>

      <div className="space-y-4">
        {/* <FormItem>
          <FormLabel>MediaMTX URL</FormLabel>

            <Input
              placeholder="http://localhost:9997"
              value={mtxUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </FormControl>
          <FormDescription>The URL of your MediaMTX server</FormDescription>
          <FormMessage />
        </FormItem> */}

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="mtx-url">MediaMTX URL</Label>
          <Input
            id="mtx-url"
            placeholder="http://localhost:9997"
            value={mtxUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
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
