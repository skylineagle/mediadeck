import { ConfigForm } from "@/app/(sub)/config/_components/config-form";

export default async function ConfigPage() {
  return (
    <div className="container py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          MediaMTX Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage your MediaMTX server configuration. Changes will be applied
          immediately.
        </p>
      </div>
      <ConfigForm />
    </div>
  );
}
