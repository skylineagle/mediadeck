import { Paths } from "@/app/(dashboard)/_components/paths";
import { Publishers } from "@/app/(dashboard)/_components/publishers";
import { Sessions } from "@/app/(dashboard)/_components/sessions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  createSearchParamsCache,
  parseAsString,
  type SearchParams,
} from "nuqs/server";
import { Suspense } from "react";

export const searchParamsCache = createSearchParamsCache({
  tab: parseAsString.withDefault("paths"),
});

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Dashboard({ searchParams }: PageProps) {
  const { tab } = await searchParamsCache.parse(searchParams);

  return (
    <Tabs value={tab} defaultValue={"paths"}>
      <TabsList>
        <TabsTrigger asChild value="paths">
          <Link href="?tab=paths" scroll={false}>
            Paths
          </Link>
        </TabsTrigger>
        <TabsTrigger asChild value="publishers">
          <Link href="?tab=publishers" scroll={false}>
            Publishers
          </Link>
        </TabsTrigger>
        <TabsTrigger disabled value="readers">
          <Link href="?tab=readers" scroll={false}>
            Readers
          </Link>
        </TabsTrigger>
        <TabsTrigger asChild value="sessions">
          <Link href="?tab=sessions" scroll={false}>
            Active Sessions
          </Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="paths">
        <Suspense fallback={<div>Loading paths...</div>}>
          <Paths />
        </Suspense>
      </TabsContent>

      <TabsContent value="publishers">
        <Suspense fallback={<div>Loading publishers...</div>}>
          <Publishers />
        </Suspense>
      </TabsContent>

      <TabsContent value="sessions">
        <Suspense fallback={<div>Loading sessions...</div>}>
          <Sessions />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
