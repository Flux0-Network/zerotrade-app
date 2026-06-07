export type Interval = "1m" | "5m" | "15m" | "60m" | "4h" | "1d";

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolInfo {
  symbol: string;
  base: string;
  label: string;
}

export const SYMBOLS: SymbolInfo[] = [
  { symbol: "BTCUSDT", base: "BTC", label: "Bitcoin" },
  { symbol: "ETHUSDT", base: "ETH", label: "Ethereum" },
  { symbol: "SOLUSDT", base: "SOL", label: "Solana" },
  { symbol: "BNBUSDT", base: "BNB", label: "BNB" },
  { symbol: "XRPUSDT", base: "XRP", label: "XRP" },
  { symbol: "ADAUSDT", base: "ADA", label: "Cardano" },
  { symbol: "DOGEUSDT", base: "DOGE", label: "Dogecoin" },
  { symbol: "AVAXUSDT", base: "AVAX", label: "Avalanche" },
];

export const INTERVALS: { value: Interval; label: string }[] = [
  { value: "1m", label: "1m" },
  { value: "5m", label: "5m" },
  { value: "15m", label: "15m" },
  { value: "60m", label: "1H" },
  { value: "4h", label: "4H" },
  { value: "1d", label: "1D" },
];

export async function fetchKlines(
  symbol: string,
  interval: Interval,
  limit = 300,
): Promise<Candle[]> {
  const res = await fetch(
    `/api/market/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
  );
  if (!res.ok) throw new Error(`Failed to load klines for ${symbol}`);
  const raw = (await res.json()) as unknown[][];
  return raw.map((entry) => ({
    time: Math.floor(Number(entry[0]) / 1000),
    open: Number(entry[1]),
    high: Number(entry[2]),
    low: Number(entry[3]),
    close: Number(entry[4]),
    volume: Number(entry[5]),
  }));
}

export interface TickerStats {
  symbol: string;
  lastPrice: number;
  changePercent: number;
}

export async function fetchTickers(symbols: string[]): Promise<TickerStats[]> {
  const res = await fetch(`/api/market/tickers`);
  if (!res.ok) throw new Error("Failed to load tickers");
  const raw = (await res.json()) as Array<{
    symbol: string;
    lastPrice: string;
    priceChangePercent: string;
  }>;
  const wanted = new Set(symbols);
  return raw
    .filter((entry) => wanted.has(entry.symbol))
    .map((entry) => ({
      symbol: entry.symbol,
      lastPrice: Number(entry.lastPrice),
      changePercent: Number(entry.priceChangePercent) * 100,
    }));
}

export function formatPrice(price: number) {
  const decimals = price >= 100 ? 2 : price >= 1 ? 4 : 6;
  return price.toLocaleString("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
