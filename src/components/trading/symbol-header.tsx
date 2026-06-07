"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SYMBOLS, fetchTickers, formatPrice, type TickerStats } from "@/lib/market";

interface SymbolHeaderProps {
  symbol: string;
}

const POLL_INTERVAL_MS = 8000;

export function SymbolHeader({ symbol }: SymbolHeaderProps) {
  const [ticker, setTicker] = useState<TickerStats | null>(null);
  const info = SYMBOLS.find((s) => s.symbol === symbol);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [stat] = await fetchTickers([symbol]);
        if (cancelled || !stat) return;
        setTicker(stat);
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
  }, [symbol]);

  const isUp = (ticker?.changePercent ?? 0) >= 0;

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h1 className="text-xl font-semibold tracking-tight">
        {info ? `${info.base}/USDT` : symbol}
      </h1>
      <span className="text-sm text-muted-foreground">{info?.label}</span>
      <span className="font-mono text-2xl font-semibold tabular-nums">
        {ticker ? formatPrice(ticker.lastPrice) : "—"}
      </span>
      <span
        className={cn(
          "font-mono text-sm tabular-nums",
          ticker ? (isUp ? "text-emerald-400" : "text-red-400") : "text-muted-foreground",
        )}
      >
        {ticker ? `${isUp ? "+" : ""}${ticker.changePercent.toFixed(2)}% (24h)` : "—"}
      </span>
    </div>
  );
}
