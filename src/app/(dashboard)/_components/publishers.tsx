import NumberFlow from "@number-flow/react";
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
import type { components } from "@/lib/mediamtx-api";
import { StreamLink } from "@/components/stream-link";

type Path = components["schemas"]["Path"];

async function getPublishers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDIAMTX_API_URL}/v3/paths/list`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch paths");
  const data = await res.json();
  return data.items as Path[];
}

export async function Publishers() {
  const paths = await getPublishers();

  // Filter paths that have active publishers
  const publisherPaths = paths?.filter((path: Path) => {
    if (!path.source) return false;
    return [
      "rtmpConn",
      "rtspSession",
      "rtspsSession",
      "srtConn",
      "webRTCSession",
    ].includes(path.source.type ?? "");
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Publishers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Readers</TableHead>
                <TableHead>Bytes Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publisherPaths?.map((path) => (
                <TableRow key={path.name}>
                  <TableCell>{path.name}</TableCell>
                  <TableCell>{path.source?.type}</TableCell>
                  <TableCell>{path.source?.id}</TableCell>
                  <TableCell>
                    <NumberFlow
                      willChange
                      continuous
                      value={path.readers?.length}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberFlow
                      willChange
                      continuous
                      value={path.bytesReceived}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-500">
                      Publishing
                    </span>
                  </TableCell>
                  <TableCell>
                    {path.name && <StreamLink name={path.name} />}
                  </TableCell>
                </TableRow>
              ))}
              {(!publisherPaths || publisherPaths.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No active publishers
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
