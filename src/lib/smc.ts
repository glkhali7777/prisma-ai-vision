// SMC Analysis engine ported from BOT-QUOTEX-PY (Python → TypeScript)
// All terminology preserved: BOS/CHoCH, Order Blocks, FVG, Liquidity, Wyckoff, etc.

export const TIMEFRAMES = {
  M1: 1,
  M3: 3,
  M5: 5,
  M15: 15,
  M30: 30,
  H1: 60,
  H4: 240,
} as const;

export type Timeframe = keyof typeof TIMEFRAMES;

export const BROKERS = [
  "Quotex",
  "Pocket Option",
  "IQ Option OTC",
  "Deriv",
  "Olymp Trade",
  "TradingView",
] as const;
export type Broker = (typeof BROKERS)[number];

export type Direction = "CALL" | "PUT" | "AGUARDAR";
export type Estrutura = "ALTA" | "BAIXA" | "LATERAL";
export type Wyckoff = "ACUMULACAO" | "MARKUP" | "DISTRIBUICAO" | "MARKDOWN";
export type Movimento = "HH" | "HL" | "LH" | "LL";
export type BosChoch =
  | "BOS_BULLISH"
  | "BOS_BEARISH"
  | "CHOCH_BULLISH"
  | "CHOCH_BEARISH"
  | "NENHUM";
export type OB = "BULLISH" | "BEARISH" | "NENHUM";
export type FVG = "BULLISH" | "BEARISH" | "NENHUM";
export type Manipulacao = "STOP_HUNT" | "FAKE_BREAKOUT" | "SPIKE" | "NENHUM";
export type VelaTipo = "BULLISH" | "BEARISH" | "DOJI";

export interface Zona {
  tipo: "OB_BULLISH" | "OB_BEARISH" | "FVG" | "SUPORTE" | "RESISTENCIA";
  nivel: "alto" | "medio" | "baixo";
  descricao: string;
}

export interface SMCAnalysis {
  id: string;
  asset: string;
  broker: Broker;
  timeframe: Timeframe;
  estrutura: Estrutura;
  fase_wyckoff: Wyckoff;
  ultimo_movimento: Movimento;
  bos_choch: BosChoch;
  order_block: OB;
  fvg: FVG;
  manipulacao_detectada: boolean;
  tipo_manipulacao: Manipulacao;
  alerta_manipulacao: string;
  padrao_vela: string;
  vela_atual: VelaTipo;
  confianca: number; // 0-100
  filtros_aprovados: number; // 0-5
  filtros_total: 5;
  filtros_lista: { nome: string; aprovado: boolean }[];
  sinal_final: Direction;
  motivo: string;
  zonas: Zona[];
  ciclo_atual: string;
  entryAt: string; // HH:MM:SS Brasília
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
  "EUR/JPY-OTC",
  "AUD/USD-OTC",
];

const PADROES = [
  "Pin Bar Bullish",
  "Pin Bar Bearish",
  "Engolfo Bullish",
  "Engolfo Bearish",
  "Doji",
  "Martelo",
  "Shooting Star",
  "Marubozu",
  "Inside Bar",
  "Tweezer Top",
  "Tweezer Bottom",
  "Morning Star",
  "Evening Star",
];

const FILTROS_NOMES = [
  "Estrutura de Mercado",
  "BOS / CHoCH",
  "Order Block / FVG",
  "Padrão de Vela",
  "Sem Manipulação",
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function brtTime(d = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
}

/** Calcula info da vela atual no horário de Brasília — porte direto do get_candle_info() em Python */
export function getCandleInfo(tfMinutes: number) {
  const now = new Date();
  // get hh:mm:ss em Brasília
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const h = parseInt(parts.hour, 10);
  const m = parseInt(parts.minute, 10);
  const s = parseInt(parts.second, 10);
  const epochSec = h * 3600 + m * 60 + s;
  const tfSec = tfMinutes * 60;
  const candleStartSec = Math.floor(epochSec / tfSec) * tfSec;
  const remaining = tfSec - (epochSec - candleStartSec);
  const progress = 1 - remaining / tfSec;

  const fmt = (sec: number) => {
    const hh = Math.floor(sec / 3600) % 24;
    const mm = Math.floor((sec % 3600) / 60);
    const ss = sec % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  return {
    open: fmt(candleStartSec),
    close: fmt((candleStartSec + tfSec) % 86400),
    remainingSec: remaining,
    progress: Math.max(0, Math.min(1, progress)),
    isNewCandle: epochSec - candleStartSec < 4,
    candleId: Math.floor(epochSec / tfSec),
    nextOpenAt: fmt((candleStartSec + tfSec) % 86400),
  };
}

export function formatCountdown(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

/** Mock SMC analysis — porte do _mock_analysis() em Python */
export function generateAnalysis(broker: Broker, timeframe: Timeframe, asset?: string): SMCAnalysis {
  const filtros = FILTROS_NOMES.map((nome) => ({ nome, aprovado: Math.random() > 0.3 }));
  const aprovados = filtros.filter((f) => f.aprovado).length;
  const manip = Math.random() < 0.18;
  const bos: BosChoch = pick([
    "BOS_BULLISH",
    "BOS_BEARISH",
    "CHOCH_BULLISH",
    "CHOCH_BEARISH",
    "NENHUM",
  ] as const);

  const wyckoff: Wyckoff = pick(["ACUMULACAO", "MARKUP", "DISTRIBUICAO", "MARKDOWN"] as const);
  const estrutura: Estrutura =
    wyckoff === "MARKUP" ? "ALTA" : wyckoff === "MARKDOWN" ? "BAIXA" : "LATERAL";

  // Direção é coerente com BOS/CHoCH quando possível
  let sinal: Direction = "AGUARDAR";
  if (aprovados >= 4 && !manip) {
    if (bos.includes("BULLISH")) sinal = "CALL";
    else if (bos.includes("BEARISH")) sinal = "PUT";
    else sinal = Math.random() > 0.5 ? "CALL" : "PUT";
  } else if (manip) {
    // Sinal de manipulação reverte expectativa
    sinal = Math.random() > 0.5 ? "CALL" : "PUT";
  }

  const ob: OB = bos.includes("BULLISH")
    ? "BULLISH"
    : bos.includes("BEARISH")
      ? "BEARISH"
      : pick(["BULLISH", "BEARISH", "NENHUM"] as const);

  const tfMin = TIMEFRAMES[timeframe];
  const candle = getCandleInfo(tfMin);

  return {
    id: crypto.randomUUID(),
    asset: asset ?? pick(ASSETS),
    broker,
    timeframe,
    estrutura,
    fase_wyckoff: wyckoff,
    ultimo_movimento: "LH",
    bos_choch: bos,
    order_block: ob,
    fvg: pick(["BULLISH", "BEARISH", "NENHUM"] as const),
    manipulacao_detectada: manip,
    tipo_manipulacao: manip ? pick(["STOP_HUNT", "FAKE_BREAKOUT", "SPIKE"] as const) : "NENHUM",
    alerta_manipulacao: manip
      ? pick([
          "Wick longo caçando liquidez acima da máxima",
          "Falsa quebra de suporte detectada",
          "Spike contra a tendência principal",
          "Stop hunt em zona de equal highs",
        ])
      : "",
    padrao_vela: pick(PADROES),
    vela_atual: pick(["BULLISH", "BEARISH", "DOJI"] as const),
    confianca: Math.min(99, 50 + aprovados * 9 + Math.floor(Math.random() * 6)),
    filtros_aprovados: aprovados,
    filtros_total: 5,
    filtros_lista: filtros,
    sinal_final: sinal,
    motivo:
      aprovados >= 4 && !manip
        ? `Confluência ${aprovados}/5 confirmada · ${bos.replace("_", " ")} alinhado ao Order Block ${ob}`
        : manip
          ? `Manipulação ativa (${pick(["STOP_HUNT", "FAKE_BREAKOUT", "SPIKE"])}) — entrada de reversão`
          : `Filtros insuficientes (${aprovados}/5) — aguardar próxima vela`,
    zonas: [
      { tipo: "OB_BULLISH", nivel: "alto", descricao: "Order Block bullish ativo no H1" },
      { tipo: "FVG", nivel: "medio", descricao: "Fair Value Gap não preenchido" },
      { tipo: "RESISTENCIA", nivel: "alto", descricao: "Liquidez acima de equal highs" },
    ],
    ciclo_atual: `Fase ${wyckoff} · ${pick(["HH e HL consecutivos", "Distribuição em range", "Acumulação institucional", "Markdown agressivo"])}`,
    entryAt: candle.nextOpenAt,
    createdAt: Date.now(),
  };
}

/** Regra do usuário: mostrar apenas 4/5 ou 5/5; manipulação e alertas sempre passam */
export function shouldDisplay(a: SMCAnalysis): boolean {
  if (a.manipulacao_detectada) return true;
  return a.filtros_aprovados >= 4 && a.sinal_final !== "AGUARDAR";
}

export { brtTime };
