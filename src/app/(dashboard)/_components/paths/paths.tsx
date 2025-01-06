"use client";

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
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { useSettings } from "@/hooks/use-settings";
import { isPathSynced } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Check, Database, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RemovePath } from "../remove-path";

type CombinedPath = {
  name: string;
  source?: {
    type: string | null;
  };
  record: boolean;
  isActive: boolean;
};

type PathsProps = {
  paths: CombinedPath[];
  configPaths: CombinedPath[];
};

export function Paths({ paths, configPaths }: PathsProps) {
  const { mtxUrl } = useMediaMtxUrl();
  const { settings } = useSettings();
  const router = useRouter();
  const { data: activePaths = [], refetch } = api.path.listPaths.useQuery(
    { mtxUrl },
    {
      refetchInterval: settings.refreshInterval,
    },
  );
  const { mutate: syncPath } = api.path.sync.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSync = (name: string) => (e: React.FormEvent) => {
    e.preventDefault();
    syncPath({ name });
  };

  // Combine all paths
  const allPaths: CombinedPath[] = [
    ...activePaths,
    ...paths.filter((path) => !activePaths.some((ap) => ap.name === path.name)),
    ...configPaths.filter(
      (path) =>
        !activePaths.some((ap) => ap.name === path.name) &&
        !paths.some((p) => p.name === path.name),
    ),
  ];

  return (
    <Card className="mx-4">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1.5">
          <CardTitle>Paths</CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">DB</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[100px]">Mode</TableHead>
                <TableHead className="w-[100px]">Record</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <Table>
              <TableBody>
                {allPaths.map((path) => {
                  const isSession =
                    path.source?.type?.endsWith("Session") ?? false;
                  const isSynced = isPathSynced(path.name, paths);

                  return (
                    <TableRow
                      key={path.name}
                      className={!isSynced ? "bg-muted/30" : undefined}
                    >
                      <TableCell key="db" className="w-[50px]">
                        {!isSession && (
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
                      <TableCell key="mode" className="w-[100px]">
                        <Badge variant={isSession ? "default" : "secondary"}>
                          {isSession ? "Session" : "Proxy"}
                        </Badge>
                      </TableCell>
                      <TableCell key="record" className="w-[100px]">
                        {path.record ? <Check /> : <X />}
                      </TableCell>
                      <TableCell key="status" className="w-[100px]">
                        {path.isActive ? (
                          <PathStatus path={path.name} />
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell key="actions" className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <StreamLink name={path.name} />
                          {!isSession && !isSynced && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <form onSubmit={handleSync(path.name)}>
                                  <Button
                                    variant="outline"
                                    type="submit"
                                    className="gap-2"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                    Sync to DB
                                  </Button>
                                </form>
                              </TooltipTrigger>
                              <TooltipContent>
                                Save this path into the database
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {!isSession && isSynced && (
                            <TogglePath
                              name={path.name}
                              isActive={path.isActive}
                              onToggle={refetch}
                            />
                          )}
                          {!isSession && isSynced && (
                            <RemovePath pathToDelete={path.name} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {allPaths.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No paths found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
