import { StreamLink } from "@/components/stream-link";
import { Badge } from "@/components/ui/badge";
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
import { isPathSynced } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Database, RefreshCw } from "lucide-react";
import Link from "next/link";
import { RemovePath } from "./remove-path";
import { PathStatus } from "@/components/path-status";

export async function Paths() {
  const paths = await api.path.getAll();
  const mediamtxPaths = await api.path.listPaths();

  const handleSync = async (name: string) => {
    "use server";
    await api.path.sync({
      name,
    });
  };

  // Get unsynced paths
  const unsyncedPaths =
    mediamtxPaths
      ?.filter((path) => path.name !== "all_others")
      ?.filter((mPath) => !paths?.some((path) => path.name === mPath.name)) ??
    [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Configured Paths</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4 text-blue-400" /> Synced to DB
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4 text-muted-foreground" /> Not synced
            </div>
          </div>
        </div>
        <Link href="/create">
          <Button>Add Path</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">DB</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>On Demand</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paths?.map((path) => {
                const isSynced = isPathSynced(path.name, paths);
                const isInMediaMTX = mediamtxPaths?.some(
                  (p) => p.name === path.name,
                );
                return (
                  <TableRow key={path.name}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      {path.name}
                    </TableCell>
                    <TableCell>{path.source}</TableCell>
                    <TableCell>{path.sourceOnDemand ? "Yes" : "No"}</TableCell>
                    <TableCell>{path.record ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <PathStatus status={isSynced ? "live" : "ready"} />
                      {/* <Badge
                        variant={
                          isSynced
                            ? isInMediaMTX
                              ? "default"
                              : "secondary"
                            : "destructive"
                        }
                      >
                        {isSynced
                          ? isInMediaMTX
                            ? "Active"
                            : "Pending"
                          : "Not Synced"}
                      </Badge> */}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Switch
                                checked={isSynced}
                                onCheckedChange={async (checked) => {
                                  "use server";
                                  await api.path.toggle({
                                    name: path.name,
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
                        {path.name && <StreamLink name={path.name} />}
                        <RemovePath pathToDelete={path.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {unsyncedPaths.map((path) => (
                <TableRow key={path.name} className="bg-muted/30">
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Database className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>Not Synced to Database</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    {path.name}
                  </TableCell>
                  <TableCell>{path.source ? path.source : "-"}</TableCell>
                  <TableCell>{path.sourceOnDemand ? "Yes" : "No"}</TableCell>
                  <TableCell>{path.record ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">MediaMTX Only</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <form
                              action={handleSync.bind(null, path.name ?? "")}
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
                      {path.name && <StreamLink name={path.name} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
