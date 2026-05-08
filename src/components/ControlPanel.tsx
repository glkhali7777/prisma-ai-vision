import { Power, Zap } from "lucide-react";
import { TIMEFRAMES, BROKERS, type Timeframe, type Broker } from "@/lib/smc";

interface Props {
  active: boolean;
  onToggle: () => void;
  onAnalyze: () => void;
  timeframe: Timeframe;
  setTimeframe: (t: Timeframe) => void;
  broker: Broker;
  setBroker: (b: Broker) => void;
  stats: { generated: number; displayed: number; calls: number; puts: number; manipulations: number };
}

export function ControlPanel({
  active,
  onToggle,
  onAnalyze,
  timeframe,
  setTimeframe,
  broker,
  setBroker,
  stats,
}: Props) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
          Núcleo de Análise SMC
        </p>
        <h2 className="font-orbitron text-xl font-bold text-foreground">Painel de Controle</h2>
      </div>

      {/* Broker */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Corretora
        </label>
        <select
          value={broker}
          onChange={(e) => setBroker(e.target.value as Broker)}
          className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-orbitron focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {BROKERS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Timeframe */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Timeframe
        </label>
        <div className="mt-1.5 grid grid-cols-4 gap-1.5">
          {(Object.keys(TIMEFRAMES) as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-2xl py-2 text-xs font-orbitron font-semibold tracking-wider transition-all ${
                timeframe === tf
                  ? "bg-prisma text-white glow-primary"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="space-y-2.5">
        <button
          onClick={onToggle}
          className={`w-full rounded-2xl px-5 py-3.5 font-orbitron text-sm font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
            active
              ? "bg-success text-background border-success shadow-[0_0_25px_hsl(160_100%_50%/0.45)] animate-pulse-glow-success"
              : "bg-destructive/15 text-destructive border-destructive/50 hover:bg-destructive/25"
          }`}
        >
          <Power className="h-4 w-4" />
          {active ? "Robô Ligado · Auto" : "Robô Desligado · Ligar"}
        </button>
        <button
          onClick={onAnalyze}
          className="w-full rounded-2xl border border-accent/40 bg-accent/10 px-5 py-3 font-orbitron text-xs font-semibold uppercase tracking-widest text-accent hover:bg-accent/20 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="h-4 w-4" />
          Analisar Agora
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5">
        <Stat label="Gerados" value={stats.generated} />
        <Stat label="Exibidos" value={stats.displayed} accent="primary" />
        <Stat label="CALL" value={stats.calls} accent="success" />
        <Stat label="PUT" value={stats.puts} accent="destructive" />
      </div>

      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Manipulações
        </span>
        <span className="font-mono-tech font-bold text-accent">{stats.manipulations}</span>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
        <Row k="Engine" v="Gemini 2.0 · SMC" />
        <Row k="Filtros mínimos" v="4 / 5" />
        <Row k="Modo manipulação" v="Ativo" valueClass="text-accent" />
        <Row k="Latência" v="12ms" valueClass="text-success" />
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "primary" | "success" | "destructive";
}) {
  const color =
    accent === "success"
      ? "text-success"
      : accent === "destructive"
        ? "text-destructive"
        : accent === "primary"
          ? "text-prisma"
          : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className={`font-mono-tech text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Row({ k, v, valueClass }: { k: string; v: string; valueClass?: string }) {
  return (
    <p className="flex items-center justify-between">
      <span>{k}</span>
      <span className={`font-mono-tech ${valueClass ?? "text-foreground"}`}>{v}</span>
    </p>
  );
}
