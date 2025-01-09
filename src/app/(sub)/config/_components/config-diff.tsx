import type { ConfigFormData } from "@/lib/schemas/config.schema";
import { isEqual } from "lodash";
import { Minus, Plus } from "lucide-react";

export function ConfigDiff({
  mtxConfig,
  dbConfig,
}: {
  mtxConfig: ConfigFormData;
  dbConfig: ConfigFormData;
}) {
  const diffs: Array<{ key: string; mtx: any; db: any }> = [];

  Object.keys(mtxConfig).forEach((key) => {
    if (
      !isEqual(
        mtxConfig[key as keyof ConfigFormData],
        dbConfig[key as keyof ConfigFormData],
      )
    ) {
      diffs.push({
        key,
        mtx: mtxConfig[key as keyof ConfigFormData],
        db: dbConfig[key as keyof ConfigFormData],
      });
    }
  });

  if (diffs.length === 0) return null;

  return (
    <div className="mt-4 space-y-4 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Plus className="h-4 w-4 text-green-500" /> MediaMTX Value
        </div>
        <div className="flex items-center gap-1">
          <Minus className="h-4 w-4 text-red-500" /> Database Value
        </div>
      </div>
      <div className="space-y-2">
        {diffs.map(({ key, mtx, db }) => (
          <div key={key} className="space-y-1">
            <div className="font-medium">{key}</div>
            <div className="flex items-center gap-2 text-sm">
              <Plus className="h-4 w-4 text-green-500" />
              <span className="text-green-600">{JSON.stringify(mtx)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Minus className="h-4 w-4 text-red-500" />
              <span className="text-red-600">{JSON.stringify(db)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
