"use client";

import { CreatePathForm } from "@/components/path-form";
import type { pathSchema } from "@/lib/schemas/path.schema";
import { api } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";

export default function CreatePathPage() {
  const router = useRouter();

  const { mutate, isPending } = api.path.create.useMutation({
    onSuccess: () => {
      toast.success("Path created successfully");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create path");
      }
      console.error(error);
    },
  });

  function handleSubmit(values: z.infer<typeof pathSchema>) {
    mutate(values);
  }

  return (
    <CreatePathForm
      onSubmit={handleSubmit}
      submitButtonText="Create Path"
      isPending={isPending}
    />
  );
}
