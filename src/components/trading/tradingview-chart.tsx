"use client";

import { useEffect, useRef } from "react";
import type { Interval } from "@/lib/market";

interface TradingViewChartProps {
  symbol: string;
  interval: Interval;
}

const EXCHANGE_PREFIX = "MEXC:";

const INTERVAL_MAP: Record<Interval, string> = {
  "1m": "1",
  "5m": "5",
  "15m": "15",
  "60m": "60",
  "4h": "240",
  "1d": "D",
};

export function TradingViewChart({ symbol, interval }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.text = JSON.stringify({
      autosize: true,
      symbol: `${EXCHANGE_PREFIX}${symbol}`,
      interval: INTERVAL_MAP[interval],
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "de_DE",
      backgroundColor: "rgba(0, 0, 0, 0)",
      gridColor: "rgba(255, 255, 255, 0.06)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      withdateranges: true,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(widget);
    container.appendChild(script);
  }, [symbol, interval]);

  return <div ref={containerRef} className="tradingview-widget-container h-full w-full" />;
}
