"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Power } from "lucide-react";
import { useRouter } from "next/navigation";

interface TogglePathProps {
  name: string;
  isActive: boolean;
}

export function TogglePath({ name, isActive }: TogglePathProps) {
  const { mtxUrl } = useMediaMtxUrl();
  const router = useRouter();
  const { mutate: togglePath } = api.path.toggle.useMutation({
    onSuccess: () => {
      router.refresh();
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
          size="icon"
          onClick={() => {
            togglePath({
              name,
              mtxUrl,
              enabled: !isActive,
            });
          }}
        >
          <Power className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{isActive ? "Stop Path" : "Start Path"}</TooltipContent>
    </Tooltip>
  );
}
