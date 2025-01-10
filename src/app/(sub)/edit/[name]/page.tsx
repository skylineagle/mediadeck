"use client";

import { CreatePathForm } from "@/components/path-form";
import { type Path } from "@/lib/schemas/path.schema";
import { api } from "@/trpc/react";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditPathPage() {
  const { name } = useParams<{ name: string }>();

  const utils = api.useUtils();
  const router = useRouter();

  const { data: path, isLoading } = api.path.getPathConfig.useQuery({
    name,
  });

  const { mutate: updatePath, isPending: isUpdating } =
    api.path.update.useMutation({
      onSuccess: () => {
        toast.success("Path updated successfully");
        router.push("/");
        utils.path.getPathConfig.invalidate({ name });
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
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-bold">
        Edit {name.charAt(0).toUpperCase() + name.slice(1)} Path
      </h1>
      <CreatePathForm
        initialData={pathWithDefaults}
        submitButtonText="Update Path"
        onSubmit={(values: Path) => updatePath(values)}
        isPending={isUpdating}
      />
    </div>
  );
}
