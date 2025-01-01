import Link from "next/link";

export default function SubLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Dashboard
        </Link>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
