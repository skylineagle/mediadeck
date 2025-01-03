import { PathStatus } from "@/components/path-status";
import { StreamLink } from "@/components/stream-link";
import { TogglePath } from "@/components/toggle-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import type { Path } from "@/lib/types";
import { isPathSynced } from "@/lib/utils";
import type { Path as DBPath } from "@/server/db/types";
import { api } from "@/trpc/server";
import { Database, RefreshCw } from "lucide-react";

export type ActivePathsProps = {
  paths: DBPath[];
  activePaths: Path[];
};

export async function ActivePaths({ paths, activePaths }: ActivePathsProps) {
  const handleSync = async (name: string) => {
    "use server";
    await api.path.sync({
      name,
    });
  };

  return (
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
                <TableHead className="w-[200px]">Type</TableHead>
                <TableHead className="w-[100px]">Mode</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activePaths.map((path) => {
                const isProxy = path.source?.type?.endsWith("Source");
                const isSynced = isPathSynced(path.name ?? "", paths ?? []);
                console.log(isSynced, isProxy);

                const type = path.source?.type?.includes("Source")
                  ? path.source?.type.split("Source")[0]
                  : path.source?.type?.split("Session")[0];

                return (
                  <TableRow key={path.name}>
                    <TableCell key="db" className="w-[50px]">
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
                    <TableCell key="name" className="w-[200px]">
                      {path.name}
                    </TableCell>
                    <TableCell key="type" className="w-[200px]">
                      {type}
                    </TableCell>
                    <TableCell key="mode" className="w-[100px]">
                      <Badge>{isProxy ? "Proxy" : "Session"}</Badge>
                    </TableCell>
                    <TableCell key="status">
                      <PathStatus path={path.name ?? ""} />
                    </TableCell>
                    <TableCell key="actions">
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
                                    size="icon"
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
                          <TogglePath name={path.name ?? ""} isActive />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {activePaths.length === 0 && (
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
  );
}
