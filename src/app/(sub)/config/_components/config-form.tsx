"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConfigFormData } from "@/lib/schemas/config.schema";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { isEqual } from "lodash";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { ConfigDiff } from "./config-diff";

export function ConfigForm() {
  const utils = api.useUtils();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [isAlertOpen, setIsAlertOpen] = useState(true);

  const { data: configs } = api.config.get.useQuery();

  const { mutate: updateConfig, isPending: isUpdating } =
    api.config.update.useMutation({
      onMutate: async (updates) => {
        // Cancel any outgoing refetches
        await utils.config.get.cancel();

        // Snapshot the previous value
        const previousConfig = utils.config.get.getData();

        // Optimistically update to the new value
        utils.config.get.setData(undefined, (old) => {
          if (!old) return old;
          return {
            ...old,
            mtxConfig: { ...old.mtxConfig, ...updates },
          };
        });

        // Return a context object with the snapshotted value
        return { previousConfig };
      },
      onError: (error, variables, context) => {
        // Revert optimistic update on error
        if (context?.previousConfig) {
          utils.config.get.setData(undefined, context.previousConfig);
        }
        if (error instanceof TRPCClientError) {
          toast.error(error.message);
        } else {
          toast.error("Failed to update configuration");
        }
      },
      onSuccess: () => {
        toast.success("Configuration updated successfully");
      },
    });

  const handleConfigChange = useCallback(
    (key: keyof ConfigFormData, value: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set optimistic update in the cache directly
      utils.config.get.setData(undefined, (old) => {
        if (!old) return old;
        return {
          ...old,
          mtxConfig: {
            ...old.mtxConfig,
            [key]: value,
          },
        };
      });

      // Debounce the actual update
      timeoutRef.current = setTimeout(() => {
        updateConfig({ [key]: value });
      }, 500);
    },
    [updateConfig, utils.config.get],
  );

  const { mutate: syncConfig, isPending: isSyncing } =
    api.config.sync.useMutation({
      onSuccess: () => {
        toast.success("Configuration synced successfully");
        utils.config.get.invalidate();
      },
      onError: (error) => {
        if (error instanceof TRPCClientError) {
          toast.error(error.message);
        } else {
          toast.error("Failed to sync configuration");
        }
      },
    });

  const handleSync = useCallback(
    (source: "mtx" | "db") => {
      syncConfig({ source });
    },
    [syncConfig],
  );

  // Check if configs are out of sync
  const isOutOfSync =
    configs?.mtxConfig &&
    configs?.dbConfig &&
    !isEqual(configs.mtxConfig, configs.dbConfig);

  if (!configs?.mtxConfig) {
    return null;
  }

  return (
    <>
      {isOutOfSync && !isUpdating && !timeoutRef.current && (
        <AlertDialog open={isAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Configuration Out of Sync</AlertDialogTitle>
              <AlertDialogDescription>
                The configuration in MediaMTX and the database are different.
                Which version would you like to use?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="h-96 space-y-4 overflow-y-auto">
              {configs?.mtxConfig && configs?.dbConfig && (
                <ConfigDiff
                  mtxConfig={configs.mtxConfig}
                  dbConfig={configs.dbConfig}
                />
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSyncing}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isSyncing}
                onClick={() => {
                  handleSync("mtx");
                  if (!isSyncing) setIsAlertOpen(false);
                }}
              >
                {isSyncing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Syncing...
                  </div>
                ) : (
                  "Use MediaMTX Version"
                )}
              </AlertDialogAction>
              <AlertDialogAction
                disabled={isSyncing}
                onClick={() => {
                  handleSync("db");
                  if (!isSyncing) setIsAlertOpen(false);
                }}
              >
                {isSyncing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Syncing...
                  </div>
                ) : (
                  "Use Database Version"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Tabs defaultValue="rtsp" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="rtsp">RTSP</TabsTrigger>
          <TabsTrigger value="rtmp">RTMP</TabsTrigger>
          <TabsTrigger value="hls">HLS</TabsTrigger>
          <TabsTrigger value="webrtc">WebRTC</TabsTrigger>
          <TabsTrigger value="srt">SRT</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <Card>
          <CardContent className="pt-6">
            <TabsContent value="metrics" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Metrics Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Metrics Address</Label>
                      <Input
                        value={configs?.mtxConfig?.metricsAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("metricsAddress", e.target.value)
                        }
                        placeholder=":9998"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the metrics server
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable Metrics</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the metrics server
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.metrics ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("metrics", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Metrics Encryption</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable TLS/HTTPS on the metrics server
                          </p>
                        </div>
                        <Switch
                          checked={
                            configs?.mtxConfig?.metricsEncryption ?? false
                          }
                          onCheckedChange={(checked) =>
                            handleConfigChange("metricsEncryption", checked)
                          }
                        />
                      </div>
                    </FormItem>

                    <div className="space-y-2">
                      <Label>Metrics Allow Origin</Label>
                      <Input
                        value={configs?.mtxConfig?.metricsAllowOrigin ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "metricsAllowOrigin",
                            e.target.value,
                          )
                        }
                        placeholder="*"
                      />
                      <p className="text-sm text-muted-foreground">
                        Value of the Access-Control-Allow-Origin header
                      </p>
                    </div>
                  </div>

                  {configs?.mtxConfig.metricsEncryption && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Metrics Server Key</Label>
                        <Input
                          value={configs?.mtxConfig?.metricsServerKey ?? ""}
                          onChange={(e) =>
                            handleConfigChange(
                              "metricsServerKey",
                              e.target.value,
                            )
                          }
                          placeholder="server.key"
                        />
                        <p className="text-sm text-muted-foreground">
                          Path to the server key (required when encryption is
                          enabled)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Metrics Server Certificate</Label>
                        <Input
                          value={configs?.mtxConfig?.metricsServerCert ?? ""}
                          onChange={(e) =>
                            handleConfigChange(
                              "metricsServerCert",
                              e.target.value,
                            )
                          }
                          placeholder="server.crt"
                        />
                        <p className="text-sm text-muted-foreground">
                          Path to the server certificate
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rtsp" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  RTSP Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RTSP Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtspAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtspAddress", e.target.value)
                        }
                        placeholder=":8554"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTSP listener
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable RTSP</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the RTSP protocol
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.rtsp ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("rtsp", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RTSPS Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtspsAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtspsAddress", e.target.value)
                        }
                        placeholder=":8322"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTSPS listener
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>RTP Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtpAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtpAddress", e.target.value)
                        }
                        placeholder=":8000"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTP listener
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RTCP Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtcpAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtcpAddress", e.target.value)
                        }
                        placeholder=":8001"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTCP listener
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Multicast IP Range</Label>
                      <Input
                        value={configs?.mtxConfig?.multicastIPRange ?? ""}
                        onChange={(e) =>
                          handleConfigChange("multicastIPRange", e.target.value)
                        }
                        placeholder="224.1.0.0/16"
                      />
                      <p className="text-sm text-muted-foreground">
                        IP range used for multicast
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Multicast RTP Port</Label>
                      <Input
                        type="number"
                        value={configs?.mtxConfig?.multicastRTPPort ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "multicastRTPPort",
                            parseInt(e.target.value),
                          )
                        }
                        placeholder="8002"
                      />
                      <p className="text-sm text-muted-foreground">
                        Port used for multicast RTP
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Multicast RTCP Port</Label>
                      <Input
                        type="number"
                        value={configs?.mtxConfig?.multicastRTCPPort ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "multicastRTCPPort",
                            parseInt(e.target.value),
                          )
                        }
                        placeholder="8003"
                      />
                      <p className="text-sm text-muted-foreground">
                        Port used for multicast RTCP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rtmp" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  RTMP Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RTMP Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtmpAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtmpAddress", e.target.value)
                        }
                        placeholder=":1935"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTMP listener
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable RTMP</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the RTMP protocol
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.rtmp ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("rtmp", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RTMP Encryption</Label>
                      <Input
                        value={configs?.mtxConfig?.rtmpEncryption ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtmpEncryption", e.target.value)
                        }
                        placeholder="no"
                      />
                      <p className="text-sm text-muted-foreground">
                        RTMP encryption type (no, optional, strict)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>RTMPS Address</Label>
                      <Input
                        value={configs?.mtxConfig?.rtmpsAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("rtmpsAddress", e.target.value)
                        }
                        placeholder=":1936"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the RTMPS listener
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hls" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  HLS Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HLS Address</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("hlsAddress", e.target.value)
                        }
                        placeholder=":8888"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the HLS listener
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable HLS</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the HLS protocol
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.hls ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("hls", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>HLS Encryption</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable TLS/HTTPS on the HLS server
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.hlsEncryption ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("hlsEncryption", checked)
                          }
                        />
                      </div>
                    </FormItem>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>HLS Always Remux</Label>
                          <p className="text-sm text-muted-foreground">
                            Always remux incoming streams
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.hlsAlwaysRemux ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("hlsAlwaysRemux", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HLS Allow Origin</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsAllowOrigin ?? ""}
                        onChange={(e) =>
                          handleConfigChange("hlsAllowOrigin", e.target.value)
                        }
                        placeholder="*"
                      />
                      <p className="text-sm text-muted-foreground">
                        Value of the Access-Control-Allow-Origin header
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>HLS Variant</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsVariant ?? ""}
                        onChange={(e) =>
                          handleConfigChange("hlsVariant", e.target.value)
                        }
                        placeholder="lowLatency"
                      />
                      <p className="text-sm text-muted-foreground">
                        HLS variant (lowLatency, standard)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HLS Segment Count</Label>
                      <Input
                        type="number"
                        value={configs?.mtxConfig?.hlsSegmentCount ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "hlsSegmentCount",
                            parseInt(e.target.value),
                          )
                        }
                        placeholder="7"
                      />
                      <p className="text-sm text-muted-foreground">
                        Number of segments to keep in the playlist
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>HLS Segment Duration</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsSegmentDuration ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "hlsSegmentDuration",
                            e.target.value,
                          )
                        }
                        placeholder="1s"
                      />
                      <p className="text-sm text-muted-foreground">
                        Duration of each segment
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HLS Part Duration</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsPartDuration ?? ""}
                        onChange={(e) =>
                          handleConfigChange("hlsPartDuration", e.target.value)
                        }
                        placeholder="200ms"
                      />
                      <p className="text-sm text-muted-foreground">
                        Duration of each partial segment
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>HLS Segment Max Size</Label>
                      <Input
                        value={configs?.mtxConfig?.hlsSegmentMaxSize ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "hlsSegmentMaxSize",
                            e.target.value,
                          )
                        }
                        placeholder="50M"
                      />
                      <p className="text-sm text-muted-foreground">
                        Maximum size of each segment
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="webrtc" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  WebRTC Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>WebRTC Address</Label>
                      <Input
                        value={configs?.mtxConfig?.webrtcAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("webrtcAddress", e.target.value)
                        }
                        placeholder=":8889"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the WebRTC listener
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable WebRTC</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the WebRTC protocol
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.webrtc ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("webrtc", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>WebRTC Encryption</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable TLS/HTTPS on the WebRTC server
                          </p>
                        </div>
                        <Switch
                          checked={
                            configs?.mtxConfig?.webrtcEncryption ?? false
                          }
                          onCheckedChange={(checked) =>
                            handleConfigChange("webrtcEncryption", checked)
                          }
                        />
                      </div>
                    </FormItem>

                    <div className="space-y-2">
                      <Label>WebRTC Allow Origin</Label>
                      <Input
                        value={configs?.mtxConfig?.webrtcAllowOrigin ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "webrtcAllowOrigin",
                            e.target.value,
                          )
                        }
                        placeholder="*"
                      />
                      <p className="text-sm text-muted-foreground">
                        Value of the Access-Control-Allow-Origin header
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>WebRTC ICE UDP Mux Address</Label>
                      <Input
                        value={configs?.mtxConfig?.webrtcICEUDPMuxAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "webrtcICEUDPMuxAddress",
                            e.target.value,
                          )
                        }
                        placeholder=":8890"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the WebRTC ICE UDP mux
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>WebRTC ICE TCP Mux Address</Label>
                      <Input
                        value={configs?.mtxConfig?.webrtcICETCPMuxAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange(
                            "webrtcICETCPMuxAddress",
                            e.target.value,
                          )
                        }
                        placeholder=":8891"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the WebRTC ICE TCP mux
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="srt" className="space-y-6">
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  SRT Configuration
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SRT Address</Label>
                      <Input
                        value={configs?.mtxConfig?.srtAddress ?? ""}
                        onChange={(e) =>
                          handleConfigChange("srtAddress", e.target.value)
                        }
                        placeholder=":8890"
                      />
                      <p className="text-sm text-muted-foreground">
                        Address of the SRT listener
                      </p>
                    </div>

                    <FormItem className="flex h-full flex-col justify-end pb-6">
                      <div className="flex items-center justify-between space-x-3">
                        <div className="space-y-0.5">
                          <Label>Enable SRT</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable the SRT protocol
                          </p>
                        </div>
                        <Switch
                          checked={configs?.mtxConfig?.srt ?? false}
                          onCheckedChange={(checked) =>
                            handleConfigChange("srt", checked)
                          }
                        />
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </>
  );
}
