import { StreamLink } from "@/components/stream-link";
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
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { RemovePath } from "./remove-path";

export async function Paths() {
  const paths = await api.path.getAll();
  const mediamtxPaths = await api.path.listPaths();

  const getStatusColor = (
    path: { name: string; enabled: boolean } | { name: string },
  ) => {
    if ("enabled" in path) {
      if (!path.enabled) return "text-red-500";
      return mediamtxPaths?.some((p) => p.name === path.name)
        ? "text-green-500"
        : "text-orange-500";
    }
    return "text-blue-500";
  };

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
      <CardHeader>
        <CardTitle>Configured Paths</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>On Demand</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paths?.map((path) => (
                <TableRow key={path.name}>
                  <TableCell>{path.name}</TableCell>
                  <TableCell>{path.source}</TableCell>
                  <TableCell>{path.sourceOnDemand ? "Yes" : "No"}</TableCell>
                  <TableCell>{path.record ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <span className={cn("font-medium", getStatusColor(path))}>
                      {path.enabled
                        ? mediamtxPaths?.some((p) => p.name === path.name)
                          ? "Active"
                          : "Pending"
                        : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <RemovePath pathToDelete={path.name} />
                      {path.name && <StreamLink name={path.name} />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {unsyncedPaths.map((path) => (
                <TableRow key={path.name}>
                  <TableCell>{path.name}</TableCell>
                  <TableCell>{path.source ? path.source : "-"}</TableCell>
                  <TableCell>{path.sourceOnDemand ? "Yes" : "No"}</TableCell>
                  <TableCell>{path.record ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <span className="text-blue-400">Not Synced</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <form action={handleSync.bind(null, path.name ?? "")}>
                        <Button variant="secondary" size="sm" type="submit">
                          Sync
                        </Button>
                      </form>
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
