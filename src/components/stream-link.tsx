import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Video } from "lucide-react";
import Link from "next/link";

interface StreamLinkProps {
  name: string;
}

export function StreamLink({ name }: StreamLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`http://localhost:8888/${name}`} target="_blank">
          <Button variant="link" size="icon" className="h-6 w-6">
            <Video className="h-3 w-3 text-blue-500" />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>View stream</TooltipContent>
    </Tooltip>
  );
}
