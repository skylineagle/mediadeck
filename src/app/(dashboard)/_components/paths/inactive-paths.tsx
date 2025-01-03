import { RemovePath } from "@/app/(dashboard)/_components/remove-path";
import { TogglePath } from "@/components/toggle-path";
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
import type { Path, PathConfig } from "@/lib/types";
import { isPathSynced } from "@/lib/utils";
import type { Path as DBPath } from "@/server/db/types";
import { Check, Database, X } from "lucide-react";
import Link from "next/link";

export type InactivePathsProps = {
  paths: DBPath[];
  activePaths: Path[];
  configPaths: PathConfig[];
};

export async function InactivePaths({
  paths,
  activePaths,
  configPaths,
}: InactivePathsProps) {
  const inactivePaths = [
    ...(paths?.filter(
      (path) => !activePaths?.some((ap) => ap.name === path.name),
    ) ?? []),
    ...(configPaths?.filter(
      (path) =>
        !activePaths?.some((ap) => ap.name === path.name) &&
        !paths?.some((p) => p.name === path.name),
    ) ?? []),
  ];

  return (
    <Card className="h-[45%]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1.5">
          <CardTitle>Inactive Paths</CardTitle>
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
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">DB</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[200px]">Source</TableHead>
                <TableHead className="w-[100px] text-center">Record</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[calc(100vh*0.45-12rem)]">
            <Table>
              <TableBody>
                {inactivePaths.map((path) => {
                  const isSynced = isPathSynced(path.name ?? "", paths ?? []);

                  return (
                    <TableRow
                      key={path.name}
                      className={!isSynced ? "bg-muted/30" : undefined}
                    >
                      <TableCell key="db" className="w-[50px]">
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
                      <TableCell key="name" className="w-[200px]">
                        {path.name}
                      </TableCell>
                      <TableCell key="type" className="w-[200px]">
                        {path.source ? path.source : "-"}
                      </TableCell>
                      <TableCell key="record" className="w-[100px] text-center">
                        {path.record ? <Check /> : <X />}
                      </TableCell>
                      <TableCell key="actions">
                        <div className="flex items-center gap-2">
                          {path.name && (
                            <TogglePath name={path.name} isActive={false} />
                          )}

                          {isSynced && (
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
        </div>
      </CardContent>
    </Card>
  );
}
