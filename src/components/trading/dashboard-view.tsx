"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { INTERVALS, type Interval } from "@/lib/market";
import { SymbolHeader } from "@/components/trading/symbol-header";
import { TradingViewChart } from "@/components/trading/tradingview-chart";
import { Watchlist } from "@/components/trading/watchlist";

export function DashboardView() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState<Interval>("60m");

  return (
    <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[1fr_280px]">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 px-5 py-4">
          <SymbolHeader key={symbol} symbol={symbol} />
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/40 p-1">
            {INTERVALS.map((item) => (
              <button
                key={item.value}
                onClick={() => setInterval(item.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  interval === item.value
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[420px] flex-1 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-2">
          <TradingViewChart symbol={symbol} interval={interval} />
        </div>
      </div>

      <aside className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold tracking-tight">Watchlist</h2>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
            Live
          </Button>
        </div>
        <Watchlist selected={symbol} onSelect={setSymbol} />
      </aside>
    </div>
  );
}
