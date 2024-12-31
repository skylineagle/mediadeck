import { Paths } from "@/app/dashboard/_components/paths";
import { Sessions } from "@/app/dashboard/_components/sessions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  createSearchParamsCache,
  parseAsString,
  SearchParams,
} from "nuqs/server";

export const searchParamsCache = createSearchParamsCache({
  tab: parseAsString.withDefault("paths"),
});

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Dashboard({ searchParams }: PageProps) {
  const { tab: activeTab } = await searchParamsCache.parse(searchParams);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">MediaMTX Dashboard</h1>
        <Link href="/create">
          <Button>Add Path</Button>
        </Link>
      </div>

      <Tabs value={activeTab} defaultValue="paths">
        <TabsList>
          <TabsTrigger asChild value="paths">
            <Link href="?tab=paths" scroll={false}>
              Paths
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="sessions">
            <Link href="?tab=sessions" scroll={false}>
              Active Sessions
            </Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paths">
          <Paths />
        </TabsContent>

        <TabsContent value="sessions">
          <Sessions />
        </TabsContent>
      </Tabs>
    </div>
  );
}
