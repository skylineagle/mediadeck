"use client";

import { CreatePathForm } from "@/components/path-form";
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { type Path } from "@/lib/schemas/path.schema";
import { api } from "@/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditPathPage() {
  const { name } = useParams<{ name: string }>();
  const { mtxUrl } = useMediaMtxUrl();
  const utils = api.useUtils();
  const router = useRouter();

  const { data: path, isLoading } = api.path.getPathConfig.useQuery({
    name,
    mtxUrl,
  });

  const { mutate: updatePath, isPending: isUpdating } =
    api.path.update.useMutation({
      onSuccess: () => {
        toast.success("Path updated successfully");
        router.push("/");
        utils.path.getPathConfig.invalidate({ name, mtxUrl });
        utils.path.getAllPaths.invalidate();
        router.refresh();
      },
      onError: (error: TRPCClientErrorLike<any>) => {
        toast.error("Failed to update path", {
          description: error.message,
        });
      },
    });

  const pathWithDefaults: Path = {
    name: path?.name ?? name,
    ...path,
  };

  return isLoading ? (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  ) : (
    <div className="mx-auto max-w-4xl space-y-8 p-4">
      <h1 className="text-2xl font-bold">Edit Path: {name}</h1>
      <CreatePathForm
        initialData={pathWithDefaults}
        submitButtonText="Update Path"
        onSubmit={(values: Path) =>
          updatePath({ data: values, mediamtx: { mtxUrl } })
        }
        isPending={isUpdating}
      />
    </div>
  );
}
