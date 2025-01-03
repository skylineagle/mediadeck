import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/server";
import { Power } from "lucide-react";

interface TogglePathProps {
  name: string;
  isActive: boolean;
}

export function TogglePath({ name, isActive }: TogglePathProps) {
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
          onClick={async () => {
            "use server";
            await api.path.toggle({
              name,
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
