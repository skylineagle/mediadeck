import { api } from "@/trpc/server";
import { ActivePaths } from "./active-paths";
import { InactivePaths } from "./inactive-paths";

export async function Paths() {
  const paths = await api.path.getAll();
  const configPaths = await api.path.listPathsConfigs();
  const activePaths = await api.path.listPaths();

  return (
    <div className="h-[calc(100vh-8rem)] space-y-4 overflow-hidden">
      <ActivePaths paths={paths} activePaths={activePaths} />
      <InactivePaths
        paths={paths}
        activePaths={activePaths}
        configPaths={configPaths}
      />
    </div>
  );
}
