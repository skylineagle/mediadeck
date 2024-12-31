"use client";

import { StreamLink } from "@/components/stream-link";
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
import { api } from "@/trpc/react";

export function Sessions() {
  const { data: sessions } = api.session.list.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active RTSP Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead>Remote Address</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Bytes Received</TableHead>
                <TableHead>Bytes Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions?.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.path}</TableCell>
                  <TableCell>{session.remoteAddr}</TableCell>
                  <TableCell>{session.state}</TableCell>
                  <TableCell>{session.bytesReceived}</TableCell>
                  <TableCell>{session.bytesSent}</TableCell>
                  <TableCell>
                    {session.path && <StreamLink name={session.path} />}
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
