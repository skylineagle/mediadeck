import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StreamLinkProps {
  name: string;
}

export function StreamLink({ name }: StreamLinkProps) {
  return (
    <Link href={`http://localhost:8889/${name}`} target="_blank">
      <Button variant="outline" size="sm">
        View Stream
      </Button>
    </Link>
  );
}
