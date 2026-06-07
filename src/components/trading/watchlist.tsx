"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SYMBOLS, fetchTickers, formatPrice, type TickerStats } from "@/lib/market";

interface WatchlistProps {
  selected: string;
  onSelect: (symbol: string) => void;
}

const POLL_INTERVAL_MS = 8000;

export function Watchlist({ selected, onSelect }: WatchlistProps) {
  const [tickers, setTickers] = useState<Record<string, TickerStats>>({});

  useEffect(() => {
    const symbols = SYMBOLS.map((s) => s.symbol);
    let cancelled = false;

    const load = async () => {
      try {
        const stats = await fetchTickers(symbols);
        if (cancelled) return;
        setTickers(Object.fromEntries(stats.map((stat) => [stat.symbol, stat])));
      } catch {
        // ignore transient polling errors
      }
    };

    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      {SYMBOLS.map((info) => {
        const ticker = tickers[info.symbol];
        const isUp = (ticker?.changePercent ?? 0) >= 0;
        return (
          <button
            key={info.symbol}
            onClick={() => onSelect(info.symbol)}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-3 text-left transition-all duration-150 active:scale-[0.98]",
              selected === info.symbol
                ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                : "hover:bg-accent/60",
            )}
          >
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">{info.base}/USDT</span>
              <span className="text-xs text-muted-foreground">{info.label}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-sm tabular-nums">
                {ticker ? formatPrice(ticker.lastPrice) : "—"}
              </span>
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  ticker ? (isUp ? "text-emerald-400" : "text-red-400") : "text-muted-foreground",
                )}
              >
                {ticker ? `${isUp ? "+" : ""}${ticker.changePercent.toFixed(2)}%` : "—"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
