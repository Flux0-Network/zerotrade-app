"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type CandlestickData,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { fetchKlines, type Interval } from "@/lib/market";
import { DrawingToolbar, type DrawingTool } from "@/components/trading/drawing-toolbar";

interface TradingChartProps {
  symbol: string;
  interval: Interval;
}

interface TimePricePoint {
  time: UTCTimestamp;
  price: number;
}

interface Drawing {
  id: string;
  tool: Exclude<DrawingTool, "cursor">;
  points: TimePricePoint[];
}

const POLL_INTERVAL_MS = 5000;
const DRAW_COLOR = "#34d399";
const DRAW_FILL = "rgba(52, 211, 153, 0.12)";

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

function drawShape(
  ctx: CanvasRenderingContext2D,
  drawing: Pick<Drawing, "tool" | "points">,
  toXY: (point: TimePricePoint) => { x: number; y: number } | null,
  canvasWidth: number,
) {
  if (drawing.tool === "horizontal") {
    const p = toXY(drawing.points[0]);
    if (!p) return;
    ctx.beginPath();
    ctx.moveTo(0, p.y);
    ctx.lineTo(canvasWidth, p.y);
    ctx.stroke();
    return;
  }

  if (drawing.points.length < 2) return;
  const a = toXY(drawing.points[0]);
  const b = toXY(drawing.points[1]);
  if (!a || !b) return;

  if (drawing.tool === "trendline") {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  } else if (drawing.tool === "rectangle") {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x);
    const h = Math.abs(b.y - a.y);
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
  }
}

let drawingId = 0;

export function TradingChart({ symbol, interval }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [tool, setTool] = useState<DrawingTool>("cursor");
  const toolRef = useRef<DrawingTool>("cursor");

  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const drawingsRef = useRef<Drawing[]>([]);
  const pendingRef = useRef<{ tool: Exclude<DrawingTool, "cursor">; start: TimePricePoint } | null>(null);
  const hoverRef = useRef<TimePricePoint | null>(null);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const chart = chartRef.current;
    const series = seriesRef.current;
    const container = containerRef.current;
    if (!canvas || !chart || !series || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const timeScale = chart.timeScale();
    const toXY = (point: TimePricePoint) => {
      const x = timeScale.timeToCoordinate(point.time as Time);
      const y = series.priceToCoordinate(point.price);
      if (x === null || y === null) return null;
      return { x, y };
    };

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = DRAW_COLOR;
    ctx.fillStyle = DRAW_FILL;

    for (const drawing of drawingsRef.current) {
      drawShape(ctx, drawing, toXY, width);
    }

    const pending = pendingRef.current;
    if (pending && hoverRef.current) {
      ctx.setLineDash([4, 4]);
      drawShape(ctx, { tool: pending.tool, points: [pending.start, hoverRef.current] }, toXY, width);
      ctx.setLineDash([]);
    }
  }, []);

  useEffect(() => {
    toolRef.current = tool;
    pendingRef.current = null;
    hoverRef.current = null;
    redraw();
  }, [tool, redraw]);

  useEffect(() => {
    drawingsRef.current = drawings;
    redraw();
  }, [drawings, redraw]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && pendingRef.current) {
        pendingRef.current = null;
        hoverRef.current = null;
        redraw();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [redraw]);

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

    const pointFromEvent = (event: MouseEvent): TimePricePoint | null => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const time = chart.timeScale().coordinateToTime(x);
      const price = series.coordinateToPrice(y);
      if (time === null || price === null) return null;
      return { time: time as UTCTimestamp, price };
    };

    // Note: lightweight-charts' built-in subscribeClick() silently swallows a
    // click if it lands >5px away from a previous click within 500ms (it tries
    // to detect a double-click and drops the event when neither check matches).
    // That makes placing two-point drawings unreliable, so we handle clicks via
    // a native listener and derive time/price ourselves from the coordinates.
    const handleClick = (event: MouseEvent) => {
      const currentTool = toolRef.current;
      if (currentTool === "cursor") return;
      if (toolbarRef.current?.contains(event.target as Node)) return;
      const point = pointFromEvent(event);
      if (!point) return;

      if (currentTool === "horizontal") {
        const drawing: Drawing = { id: `d${drawingId++}`, tool: "horizontal", points: [point] };
        setDrawings((prev) => [...prev, drawing]);
        return;
      }

      const pending = pendingRef.current;
      if (!pending || pending.tool !== currentTool) {
        pendingRef.current = { tool: currentTool, start: point };
        hoverRef.current = point;
      } else {
        const drawing: Drawing = {
          id: `d${drawingId++}`,
          tool: pending.tool,
          points: [pending.start, point],
        };
        setDrawings((prev) => [...prev, drawing]);
        pendingRef.current = null;
        hoverRef.current = null;
      }
      redraw();
    };

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      if (!pendingRef.current) return;
      if (!param.point || param.time === undefined) {
        hoverRef.current = null;
      } else {
        const price = series.coordinateToPrice(param.point.y);
        hoverRef.current = price !== null ? { time: param.time as UTCTimestamp, price } : null;
      }
      redraw();
    };

    container.addEventListener("click", handleClick);
    chart.subscribeCrosshairMove(handleCrosshairMove);
    chart.timeScale().subscribeVisibleLogicalRangeChange(redraw);

    const resizeObserver = new ResizeObserver(() => redraw());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("click", handleClick);
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(redraw);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [redraw]);

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
      redraw();

      timer = setInterval(async () => {
        try {
          const latest = await fetchKlines(symbol, interval, 2);
          if (cancelled) return;
          for (const candle of latest) {
            series.update(toBar(candle));
          }
          redraw();
        } catch {
          // ignore transient polling errors
        }
      }, POLL_INTERVAL_MS);
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [symbol, interval, redraw]);

  return (
    <div
      ref={containerRef}
      className={tool === "cursor" ? "relative h-full w-full" : "relative h-full w-full cursor-crosshair"}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1]" />
      <div ref={toolbarRef}>
        <DrawingToolbar
          tool={tool}
          onToolChange={setTool}
          onClear={() => setDrawings([])}
          hasDrawings={drawings.length > 0}
        />
      </div>
    </div>
  );
}
