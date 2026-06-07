import { NextResponse } from "next/server";

const API_BASE = "https://api.mexc.com/api/v3";
const ALLOWED_INTERVALS = new Set(["1m", "5m", "15m", "60m", "4h", "1d"]);
const SYMBOL_PATTERN = /^[A-Z0-9]{2,20}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "";
  const interval = searchParams.get("interval") ?? "";
  const limit = searchParams.get("limit") ?? "300";

  if (!SYMBOL_PATTERN.test(symbol) || !ALLOWED_INTERVALS.has(interval)) {
    return NextResponse.json({ error: "Invalid symbol or interval" }, { status: 400 });
  }

  const upstream = await fetch(
    `${API_BASE}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    { next: { revalidate: 0 } },
  );

  if (!upstream.ok) {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
