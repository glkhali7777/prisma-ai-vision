export type Direction = "CALL" | "PUT";
export type SignalKind = "FILTERED" | "MANIPULATION" | "ALERT";

export interface Signal {
  id: string;
  asset: string;
  direction: Direction;
  expiry: string; // M1, M5
  entryAt: string; // HH:MM
  filtersPassed: number; // 0..5
  filtersTotal: 5;
  filters: { name: string; passed: boolean }[];
  kind: SignalKind;
  confidence: number; // 0..100
  createdAt: number;
}

const ASSETS = [
  "EUR/USD-OTC",
  "GBP/JPY-OTC",
  "AUD/CAD-OTC",
  "USD/BRL-OTC",
  "EUR/GBP-OTC",
  "BTC/USD",
  "ETH/USD",
  "USD/JPY-OTC",
];

const FILTER_NAMES = [
  "Tendência EMA",
  "RSI Divergência",
  "Volume Spike",
  "Suporte/Resistência",
  "Padrão Candle",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmtTime(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function generateCandidate(): Signal {
  const filters = FILTER_NAMES.map((name) => ({
    name,
    passed: Math.random() > 0.35,
  }));
  const passed = filters.filter((f) => f.passed).length;

  // Decide kind
  const r = Math.random();
  let kind: SignalKind;
  if (r < 0.12) kind = "ALERT";
  else if (r < 0.32) kind = "MANIPULATION";
  else kind = "FILTERED";

  const direction: Direction = Math.random() > 0.5 ? "CALL" : "PUT";
  const entry = new Date(Date.now() + 60_000);

  return {
    id: crypto.randomUUID(),
    asset: pick(ASSETS),
    direction,
    expiry: pick(["M1", "M5"]),
    entryAt: fmtTime(entry),
    filtersPassed: passed,
    filtersTotal: 5,
    filters,
    kind,
    confidence: Math.min(99, 55 + passed * 8 + Math.floor(Math.random() * 8)),
    createdAt: Date.now(),
  };
}

/** Apply user rule: only show FILTERED if 4/5 or 5/5; manipulation & alerts always pass. */
export function shouldDisplay(s: Signal): boolean {
  if (s.kind === "MANIPULATION" || s.kind === "ALERT") return true;
  return s.filtersPassed >= 4;
}
