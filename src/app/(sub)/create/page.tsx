"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { pathSchema } from "@/lib/schemas/config.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export default function CreatePathForm() {
  const { mtxUrl } = useMediaMtxUrl();
  const router = useRouter();
  const form = useForm<z.infer<typeof pathSchema>>({
    resolver: zodResolver(pathSchema),
    defaultValues: {
      // Basic Settings
      sourceOnDemand: false,
      maxReaders: 0,

      // Recording Settings
      record: false,
      recordFormat: "fmp4",
      recordPartDuration: "1s",
      recordSegmentDuration: "1h",
      recordDeleteAfter: "24h",

      // Publisher Settings
      overridePublisher: false,

      // RTSP Settings
      rtspTransport: "automatic",
      rtspAnyPort: false,

      // RPi Camera Settings
      rpiCameraCamID: 0,
      rpiCameraWidth: 1920,
      rpiCameraHeight: 1080,
      rpiCameraHFlip: false,
      rpiCameraVFlip: false,
      rpiCameraBrightness: 0,
      rpiCameraContrast: 1,
      rpiCameraSaturation: 1,
      rpiCameraSharpness: 1,
      rpiCameraExposure: "normal",
      rpiCameraAWB: "auto",
      rpiCameraAWBGains: [0, 0],
      rpiCameraDenoise: "off",
      rpiCameraShutter: 0,
      rpiCameraMetering: "centre",
      rpiCameraGain: 0,
      rpiCameraEV: 0,
      rpiCameraHDR: false,
      rpiCameraFPS: 30,
      rpiCameraAfMode: "continuous",
      rpiCameraAfRange: "normal",
      rpiCameraAfSpeed: "normal",
      rpiCameraLensPosition: 0,
      rpiCameraFlickerPeriod: 0,
      rpiCameraTextOverlayEnable: false,
      rpiCameraTextOverlay: "%Y-%m-%d %H:%M:%S - MediaMTX",
      rpiCameraCodec: "auto",
      rpiCameraIDRPeriod: 60,
      rpiCameraBitrate: 5000000,
      rpiCameraProfile: "main",
      rpiCameraLevel: "4.1",

      // Hooks
      runOnInitRestart: false,
      runOnDemandRestart: false,
      runOnReadyRestart: false,
      runOnReadRestart: false,
    },
  });

  const { mutate, isPending } = api.path.create.useMutation({
    onSuccess: () => {
      toast.success("Path created successfully");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create path");
      }
      console.error(error);
    },
  });

  function onSubmit(values: z.infer<typeof pathSchema>) {
    console.log(values);
    mutate({ data: values, mediamtx: { mtxUrl } });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      <h1 className="text-2xl font-bold">Create New Path</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="recording">Recording</TabsTrigger>
              <TabsTrigger value="publisher">Publisher</TabsTrigger>
              <TabsTrigger value="rtsp">RTSP</TabsTrigger>
              <TabsTrigger value="rpi">RPi Camera</TabsTrigger>
              <TabsTrigger value="hooks">Hooks</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Path Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter path name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The unique name for this path
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL</FormLabel>
                        <FormControl>
                          <Input placeholder="rtsp://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Source URL for the stream
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceOnDemand"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Source On Demand</FormLabel>
                          <FormDescription>
                            Connect to source only when requested
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sourceOnDemandStartTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source On Demand Start Timeout</FormLabel>
                        <FormControl>
                          <Input placeholder="10s" {...field} />
                        </FormControl>
                        <FormDescription>
                          Timeout for source connection
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxReaders"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Max Readers</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            onChange={(e) =>
                              onChange(parseInt(e.target.value) || 0)
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of readers (0 for unlimited)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fallback"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fallback Path</FormLabel>
                        <FormControl>
                          <Input placeholder="fallback-path" {...field} />
                        </FormControl>
                        <FormDescription>
                          Path to use when this path is not ready
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recording">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="record"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Recording</FormLabel>
                          <FormDescription>
                            Record the stream to disk
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recordPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Path</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/recordings"
                            {...field}
                            disabled={!form.watch("record")}
                          />
                        </FormControl>
                        <FormDescription>
                          Path where recordings will be saved
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recordFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Record Format</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch("record")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mp4">MP4</SelectItem>
                            <SelectItem value="fmp4">Fragmented MP4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Format of the recorded files
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recordDeleteAfter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delete After</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="24h"
                            {...field}
                            disabled={!form.watch("record")}
                          />
                        </FormControl>
                        <FormDescription>
                          Delete recordings after this duration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publisher">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="overridePublisher"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Override Publisher</FormLabel>
                          <FormDescription>
                            Allow overriding an existing publisher
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="srtPublishPassphrase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SRT Publish Passphrase</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Passphrase for SRT publishing
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="srtReadPassphrase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SRT Read Passphrase</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Passphrase for SRT reading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rtsp">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="rtspTransport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RTSP Transport</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="udp">UDP</SelectItem>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="udp_multicast">
                              UDP Multicast
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          RTSP transport protocol
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rtspAnyPort"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>RTSP Any Port</FormLabel>
                          <FormDescription>
                            Use any available port for RTSP
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rpi">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rpiCameraWidth"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1920"
                              onChange={(e) =>
                                onChange(parseInt(e.target.value) || 0)
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rpiCameraHeight"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1080"
                              onChange={(e) =>
                                onChange(parseInt(e.target.value) || 0)
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rpiCameraHFlip"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Horizontal Flip</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rpiCameraVFlip"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Vertical Flip</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="rpiCameraFPS"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>FPS</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            onChange={(e) =>
                              onChange(parseInt(e.target.value) || 0)
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hooks">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <FormField
                    control={form.control}
                    name="runOnInit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Run on Init</FormLabel>
                        <FormControl>
                          <Input placeholder="ffmpeg -i ..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Command to run when path is initialized
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="runOnDemand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Run on Demand</FormLabel>
                        <FormControl>
                          <Input placeholder="ffmpeg -i ..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Command to run when path is demanded
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="runOnReady"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Run on Ready</FormLabel>
                        <FormControl>
                          <Input placeholder="ffmpeg -i ..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Command to run when path becomes ready
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="runOnRead"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Run on Read</FormLabel>
                        <FormControl>
                          <Input placeholder="ffmpeg -i ..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Command to run when path is read
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Path"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
