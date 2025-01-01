import { PathStatus } from "@/components/path-status";
import { StreamLink } from "@/components/stream-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { isPathSynced } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Database, RefreshCw } from "lucide-react";
import Link from "next/link";
import { RemovePath } from "./remove-path";

export async function Paths() {
  const paths = await api.path.getAll();
  const configPaths = await api.path.listPathsConfigs();
  const activePaths = await api.path.listPaths();

  const handleSync = async (name: string) => {
    "use server";
    await api.path.sync({
      name,
    });
  };

  // Get all active paths and their sync status
  const allActivePaths =
    activePaths?.filter((path) => path.name !== "all_others") ?? [];

  // Get all inactive paths (configured but not active)
  const inactivePaths = [
    ...(paths?.filter(
      (path) => !activePaths?.some((ap) => ap.name === path.name),
    ) ?? []),
    ...(configPaths?.filter(
      (path) =>
        path.name !== "all_others" &&
        !activePaths?.some((ap) => ap.name === path.name) &&
        !paths?.some((p) => p.name === path.name),
    ) ?? []),
  ];

  return (
    <div className="h-[calc(100vh-8rem)] space-y-4 overflow-hidden">
      <Card className="h-[50%]">
        <CardHeader className="pb-4">
          <CardTitle>Active Paths</CardTitle>
          <p className="text-sm text-muted-foreground">
            These paths are currently active in MediaMTX
          </p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100%-6rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">DB</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[200px]">Source</TableHead>
                  <TableHead className="w-[100px]">Mode</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allActivePaths.map((path) => {
                  const isProxy = path.source?.type?.endsWith("Source");
                  const isSynced = isPathSynced(path.name ?? "", paths ?? []);
                  const configPath = configPaths?.find(
                    (p) => p.name === path.name,
                  );

                  return (
                    <TableRow key={path.name}>
                      <TableCell className="w-[50px]">
                        {isProxy && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Database
                                  className={`h-4 w-4 ${isSynced ? "text-blue-400" : "text-muted-foreground"}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {isSynced
                                  ? "Synced to Database"
                                  : "Not Synced to Database"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="w-[200px]">{path.name}</TableCell>
                      <TableCell className="w-[200px]">
                        {configPath?.source ?? path.source?.type ?? "-"}
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <Badge>{isProxy ? "Proxy" : "Session"}</Badge>
                      </TableCell>
                      <TableCell>
                        <PathStatus path={path.name ?? ""} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isProxy && !isSynced && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <form
                                    action={handleSync.bind(
                                      null,
                                      path.name ?? "",
                                    )}
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      type="submit"
                                      className="gap-2"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                      Sync to DB
                                    </Button>
                                  </form>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Import this path into the database
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {path.name && <StreamLink name={path.name} />}
                          {isProxy && isSynced && (
                            <RemovePath pathToDelete={path.name ?? ""} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {allActivePaths.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No active paths
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="h-[45%]">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1.5">
            <CardTitle>Inactive Paths</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4 text-blue-400" /> Synced to DB
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4 text-muted-foreground" /> Not
                synced
              </div>
            </div>
          </div>
          <Link href="/create">
            <Button>Add Path</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100%-6rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">DB</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[200px]">Source</TableHead>
                  <TableHead className="w-[100px] text-center">
                    On Demand
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    Record
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactivePaths.map((path) => {
                  const isSynced = isPathSynced(path.name ?? "", paths ?? []);
                  const isProxy = path.source?.endsWith("Source");
                  return (
                    <TableRow
                      key={path.name}
                      className={!isSynced ? "bg-muted/30" : undefined}
                    >
                      <TableCell className="w-[50px]">
                        {isProxy && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Database
                                  className={`h-4 w-4 ${isSynced ? "text-blue-400" : "text-muted-foreground"}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                {isSynced
                                  ? "Synced to Database"
                                  : "Not Synced to Database"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </TableCell>
                      <TableCell className="w-[200px]">{path.name}</TableCell>
                      <TableCell className="w-[200px]">
                        {path.source ? path.source : "-"}
                      </TableCell>
                      <TableCell className="w-[100px] text-center">
                        {path.sourceOnDemand ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="w-[100px] text-center">
                        {path.record ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isProxy &&
                            (!isSynced ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <form
                                      action={handleSync.bind(
                                        null,
                                        path.name ?? "",
                                      )}
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        type="submit"
                                        className="gap-2"
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                        Sync to DB
                                      </Button>
                                    </form>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Import this path into the database
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Switch
                                      checked={isSynced}
                                      onCheckedChange={async (checked) => {
                                        "use server";
                                        await api.path.toggle({
                                          name: path.name ?? "",
                                          enabled: checked,
                                        });
                                      }}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {isSynced ? "Disable Path" : "Enable Path"}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ))}
                          {path.name && <StreamLink name={path.name} />}
                          {isProxy && isSynced && (
                            <RemovePath pathToDelete={path.name ?? ""} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {inactivePaths.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No inactive paths
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
