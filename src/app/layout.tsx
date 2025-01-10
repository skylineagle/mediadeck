import { AnimatedThemeToggle } from "@/components/animated-theme-toggle";
import { MediaMtxStatus } from "@/components/mediamtx-status";
import { MetricsPoller } from "@/components/metrics-poller";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TRPCReactProvider } from "@/trpc/react";
import { GeistSans } from "geist/font/sans";
import { Settings2 } from "lucide-react";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Media Deck",
  description: "Media Deck",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <NuqsAdapter>
              <TRPCReactProvider>
                <div className="container mx-auto h-full p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <h1 className="text-3xl font-bold">Media Deck</h1>
                      <MediaMtxStatus />
                    </div>

                    <div className="flex items-center gap-5">
                      <Link href="/config">
                        <Settings2 className="h-6 w-6" />
                      </Link>
                      <AnimatedThemeToggle />
                    </div>
                  </div>
                  {children}
                  <MetricsPoller />
                </div>
              </TRPCReactProvider>
            </NuqsAdapter>
            <Toaster closeButton />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
