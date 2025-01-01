"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import type { RouterInputs } from "@/trpc/react";
import { TRPCClientError } from "@trpc/client";

type CreatePath = RouterInputs["path"]["create"];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  source: z.string().optional(),
  sourceOnDemand: z.boolean().optional(),
  sourceOnDemandStartTimeout: z.string().optional(),
  sourceOnDemandCloseAfter: z.string().optional(),
  fallback: z.string().optional(),
  record: z.boolean().optional(),
  recordPath: z.string().optional(),
  recordFormat: z.string().optional(),
}) satisfies z.ZodType<CreatePath>;

export default function CreatePathForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceOnDemand: false,
      record: false,
    },
  });

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="mb-6 text-2xl font-bold">Create New Path</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Path Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter path name" {...field} />
                </FormControl>
                <FormDescription>The unique name for this path</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL</FormLabel>
                <FormControl>
                  <Input placeholder="rtsp://..." {...field} />
                </FormControl>
                <FormDescription>
                  Source URL for the stream (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sourceOnDemand"
            render={({ field: { value, onChange } }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={value} onCheckedChange={onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Source On Demand</FormLabel>
                  <FormDescription>
                    Connect to source only when requested
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="record"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field?.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Enable Recording</FormLabel>
                  <FormDescription>Record the stream to disk</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create Path"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
