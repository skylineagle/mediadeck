import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Link from "next/link";

interface StreamLinkProps {
  name: string;
}

export function StreamLink({ name }: StreamLinkProps) {
  return (
    <Link href={`http://localhost:8888/${name}`} target="_blank">
      <Button variant="outline" size="icon">
        <Video className="h-4 w-4" />
      </Button>
    </Link>
  );
}
