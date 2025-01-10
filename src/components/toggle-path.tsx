"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Loader2, Power } from "lucide-react";
import { toast } from "sonner";

interface TogglePathProps {
  name: string;
  isActive: boolean;
  onToggle?: () => void;
}

export function TogglePath({ name, isActive, onToggle }: TogglePathProps) {
  const { mutate: togglePath, isPending } = api.path.toggle.useMutation({
    onSuccess: () => {
      toast.success(
        `Successfully ${isActive ? "stopped" : "started"} path ${name}`,
        {
          id: `toggle-path-${name}`,
        },
      );
      onToggle?.();
    },
    onMutate: () => {
      toast.loading(`${isActive ? "Stopping" : "Starting"} path ${name}...`, {
        id: `toggle-path-${name}`,
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to ${isActive ? "stop" : "start"} path ${name}: ${error.message}`,
        {
          id: `toggle-path-${name}`,
        },
      );
    },
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="default"
          className={cn(
            "bg-emerald-500 text-white hover:bg-emerald-600",
            isActive && "bg-red-500 text-white hover:bg-red-600",
          )}
          disabled={isPending}
          size="icon"
          onClick={() => {
            togglePath({
              name,
              enabled: !isActive,
            });
          }}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Power className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isActive ? "Stop" : "Start"} {name} Path
      </TooltipContent>
    </Tooltip>
  );
}
