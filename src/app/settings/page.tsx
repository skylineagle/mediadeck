"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  mediaMtxUrl: z.string().url("Please enter a valid URL"),
  refreshInterval: z
    .number()
    .min(1000, "Minimum refresh interval is 1000ms")
    .max(60000, "Maximum refresh interval is 60000ms"),
});

export default function SettingsPage() {
  const [settings, setSettings] = useLocalStorage("app-settings", {
    mediaMtxUrl: "http://localhost:9997",
    refreshInterval: 5000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSettings(values);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure your application settings
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="mediaMtxUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MediaMTX URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://localhost:9997" {...field} />
                  </FormControl>
                  <FormDescription>
                    The URL of your MediaMTX server
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refreshInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refresh Interval (ms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    How often to refresh the session data (in milliseconds)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Settings</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
