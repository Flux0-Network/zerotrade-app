import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardView } from "@/components/trading/dashboard-view";

export const metadata = {
  title: "Dashboard — ZeroTrade",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-6">
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
      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
        <DashboardView />
      </main>
    </div>
  );
}
