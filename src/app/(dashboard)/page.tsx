import { Paths } from "@/app/(dashboard)/_components/paths/paths";
import { Suspense } from "react";

export default async function Dashboard() {
  return (
    <Suspense fallback={<div>Loading paths...</div>}>
      <Paths />
    </Suspense>
  );
}
