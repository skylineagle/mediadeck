import { Paths } from "@/app/(dashboard)/_components/paths/paths";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { ConfigForm } from "@/app/(sub)/config/_components/config-form";

export default async function Dashboard() {
  return (
    <Tabs defaultValue="paths">
      <TabsList>
        <TabsTrigger value="paths">Paths</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
      </TabsList>
      <TabsContent value="paths">
        <Suspense fallback={<div>Loading paths...</div>}>
          <Paths />
        </Suspense>
      </TabsContent>
      <TabsContent value="config">
        <ConfigForm />
      </TabsContent>
    </Tabs>
  );
}
