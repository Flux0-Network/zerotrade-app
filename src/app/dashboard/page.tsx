import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/components/trading/dashboard-view";

export const metadata = {
  title: "Dashboard — ZeroTrade",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 w-full items-center justify-between px-4 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
              Z
            </span>
            <span>ZeroTrade</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
              Zur Startseite
            </Link>
            <Button>Konto</Button>
          </div>
        </div>
      </header>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        <DashboardView />
      </main>
    </div>
  );
}
