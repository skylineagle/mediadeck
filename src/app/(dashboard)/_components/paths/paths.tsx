"use client";

import { RemovePath } from "@/app/(dashboard)/_components/remove-path";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { PathStatus } from "@/components/path-status";
import { StreamLink } from "@/components/stream-link";
import { TogglePath } from "@/components/toggle-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDataTable } from "@/hooks/use-data-table";
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { useSettings } from "@/hooks/use-settings";
import { isPathSynced } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { CombinedPath } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Check, Database, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { filterFields } from "./const";

export function Paths() {
  const { mtxUrl } = useMediaMtxUrl();
  const { settings } = useSettings();
  const router = useRouter();
  const { data: paths = [], refetch } = api.path.getAllPaths.useQuery(
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

  const handleSync = useCallback(
    (name: string) => (e: React.FormEvent) => {
      e.preventDefault();
      syncPath({ name });
    },
    [syncPath],
  );

  const columns: ColumnDef<CombinedPath>[] = useMemo(
    () => [
      {
        id: "db",
        header: "DB",
        cell: ({ row }) => {
          const path = row.original;
          const isSession = path.source?.type?.endsWith("Session") ?? false;
          const isSynced = isPathSynced(path.name, paths);

          if (isSession) return null;

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Database
                    className={`h-4 w-4 ${isSynced ? "text-blue-400" : "text-muted-foreground"}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {isSynced ? "Synced to Database" : "Not Synced to Database"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.name;
          const b = rowB.original.name;
          return a.localeCompare(b);
        },
        filterFn: (row, id, value) => {
          return row
            .getValue<string>("name")
            .toLowerCase()
            .includes(value.toLowerCase());
        },
      },
      {
        accessorKey: "source",
        id: "source",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Mode" />
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.source?.type?.endsWith("Session") ?? false;
          const b = rowB.original.source?.type?.endsWith("Session") ?? false;
          return a === b ? 0 : a ? -1 : 1;
        },
        cell: ({ row }) => {
          const path = row.original;
          const isSession = path.source?.type?.endsWith("Session") ?? false;
          return (
            <Badge variant={isSession ? "default" : "secondary"}>
              {isSession ? "Session" : "Proxy"}
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          const isSession =
            row.original.source?.type?.endsWith("Session") ?? false;
          const mode = isSession ? "Session" : "Proxy";
          return value.includes(mode);
        },
      },
      {
        accessorKey: "record",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Record" />
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.record ?? false;
          const b = rowB.original.record ?? false;
          return a === b ? 0 : a ? -1 : 1;
        },
        cell: ({ row }) => {
          const path = row.original;
          return path.record ? (
            <Badge variant="secondary">
              <Check className="h-4 w-4" />
            </Badge>
          ) : (
            <Badge variant="secondary">
              <X className="h-4 w-4" />
            </Badge>
          );
        },
        filterFn: (row, id, value) => {
          console.log(value);

          return value.includes(row.original.record.toString());
        },
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        enableSorting: true,
        sortingFn: (rowA, rowB) => {
          const a = rowA.original.isActive ?? false;
          const b = rowB.original.isActive ?? false;
          return a === b ? 0 : a ? -1 : 1;
        },
        cell: ({ row }) => {
          const path = row.original;
          return path.isActive ? (
            <PathStatus path={path.name} />
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          );
        },
        filterFn: (row, id, value) => {
          return value.includes(row.original.isActive.toString());
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const path = row.original;
          const isSession = path.source?.type?.endsWith("Session") ?? false;
          const isSynced = isPathSynced(path.name, paths);

          return (
            <div className="flex items-center gap-2">
              <StreamLink name={path.name} />
              {!isSession && !isSynced && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <form onSubmit={handleSync(path.name)}>
                      <Button variant="outline" type="submit" className="gap-2">
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
          );
        },
      },
    ],
    [handleSync, paths, refetch],
  );

  const { table } = useDataTable({
    data: paths,
    columns,
    pageCount: Math.ceil(paths.length / 10),
    filterFields,
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
  });

  return (
    <div className="mx-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight">Paths</h2>
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
      </div>

      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </div>
  );
}
