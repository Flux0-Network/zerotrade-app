import { NextResponse } from "next/server";

const API_BASE = "https://api.mexc.com/api/v3";

export async function GET() {
  const upstream = await fetch(`${API_BASE}/ticker/24hr`, { next: { revalidate: 0 } });

  if (!upstream.ok) {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }

  const data = await upstream.json();
  return NextResponse.json(data);
}
