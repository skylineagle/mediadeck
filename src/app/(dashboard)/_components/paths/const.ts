import type { CombinedPath, DataTableFilterField } from "@/types";

export const filterFields: DataTableFilterField<CombinedPath>[] = [
  {
    id: "name",
    label: "Name",
    placeholder: "Filter by name...",
  },
  {
    id: "isActive",
    label: "Status",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
  },
  {
    id: "record",
    label: "Record",
    options: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
  },
  {
    id: "source",
    label: "Mode",
    options: [
      { label: "Session", value: "Session" },
      { label: "Proxy", value: "Proxy" },
    ],
  },
];
