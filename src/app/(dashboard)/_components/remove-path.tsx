"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMediaMtxUrl } from "@/hooks/use-mediamtx-url";
import { api } from "@/trpc/react";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type RemovePathProps = {
  pathToDelete: string;
};

export function RemovePath({ pathToDelete }: RemovePathProps) {
  const { mtxUrl } = useMediaMtxUrl();
  const router = useRouter();
  const { mutate: removePath } = api.path.remove.useMutation({
    onSuccess: () => {
      toast.success("Path removed successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to remove path");
      console.error(error);
    },
  });

  const handleRemove = () => {
    if (pathToDelete) {
      removePath({ mtxUrl, name: pathToDelete });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove this path from the media server and the db.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemove}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
