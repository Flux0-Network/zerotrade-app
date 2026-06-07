"use client";

import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { fetchKlines, type Interval } from "@/lib/market";

interface TradingChartProps {
  symbol: string;
  interval: Interval;
}

const POLL_INTERVAL_MS = 5000;

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
});

function tickMarkFormatter(time: UTCTimestamp) {
  const date = new Date(time * 1000);
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
}

export function TradingChart({ symbol, interval }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(180, 180, 180, 1)",
        fontFamily: "var(--font-sans)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.06)" },
        horzLines: { color: "rgba(255, 255, 255, 0.06)" },
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
        tickMarkFormatter,
      },
      localization: {
        timeFormatter: tickMarkFormatter,
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      crosshair: {
        vertLine: { color: "rgba(180, 180, 180, 0.4)", labelBackgroundColor: "rgba(68, 68, 68, 1)" },
        horzLine: { color: "rgba(180, 180, 180, 0.4)", labelBackgroundColor: "rgba(68, 68, 68, 1)" },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart) return;

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const toBar = (candle: { time: number; open: number; high: number; low: number; close: number }) => ({
      time: candle.time as UTCTimestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    });

    fetchKlines(symbol, interval).then((candles) => {
      if (cancelled) return;
      const data: CandlestickData[] = candles.map(toBar);
      series.setData(data);
      chart.timeScale().fitContent();

      timer = setInterval(async () => {
        try {
          const latest = await fetchKlines(symbol, interval, 2);
          if (cancelled) return;
          for (const candle of latest) {
            series.update(toBar(candle));
          }
        } catch {
          // ignore transient polling errors
        }
      }, POLL_INTERVAL_MS);
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [symbol, interval]);

  return <div ref={containerRef} className="h-full w-full" />;
}
