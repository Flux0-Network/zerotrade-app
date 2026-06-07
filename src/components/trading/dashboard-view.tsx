"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { INTERVALS, type Interval } from "@/lib/market";
import { SymbolHeader } from "@/components/trading/symbol-header";
import { TradingViewChart } from "@/components/trading/tradingview-chart";
import { Watchlist } from "@/components/trading/watchlist";

export function DashboardView() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState<Interval>("60m");

  return (
    <div className="flex flex-col gap-3 p-3 lg:grid lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_300px]">
      <div className="flex flex-col gap-3 lg:min-h-0">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 px-5 py-3">
          <SymbolHeader key={symbol} symbol={symbol} />
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/40 p-1">
            {INTERVALS.map((item) => (
              <button
                key={item.value}
                onClick={() => setInterval(item.value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  interval === item.value
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[480px] flex-1 overflow-hidden rounded-xl border border-border/60 bg-card/40 p-2 lg:min-h-0">
          <TradingViewChart symbol={symbol} interval={interval} />
        </div>
      </div>

      <aside className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-3 lg:min-h-0">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold tracking-tight">Watchlist</h2>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
          <Watchlist selected={symbol} onSelect={setSymbol} />
        </div>
      </aside>
    </div>
  );
}
