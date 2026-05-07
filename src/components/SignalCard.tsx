import { ArrowDownRight, ArrowUpRight, AlertTriangle, Zap, ShieldCheck } from "lucide-react";
import type { Signal } from "@/lib/signals";

const kindMeta = {
  FILTERED: {
    label: "Sinal Filtrado",
    Icon: ShieldCheck,
    badgeClass: "bg-primary/15 text-primary border-primary/40",
  },
  MANIPULATION: {
    label: "Manipulação Detectada",
    Icon: Zap,
    badgeClass: "bg-accent/15 text-accent border-accent/40",
  },
  ALERT: {
    label: "Alerta de Mercado",
    Icon: AlertTriangle,
    badgeClass: "bg-destructive/15 text-destructive border-destructive/40",
  },
} as const;

export function SignalCard({ signal }: { signal: Signal }) {
  const isCall = signal.direction === "CALL";
  const meta = kindMeta[signal.kind];
  const dirColor = isCall ? "text-success" : "text-destructive";
  const dirGlow = isCall ? "animate-pulse-glow-success" : "animate-pulse-glow-destructive";
  const DirIcon = isCall ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="animate-fade-in-up rounded-2xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
      <header className="flex items-center justify-between gap-3 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-orbitron font-semibold uppercase tracking-widest ${meta.badgeClass}`}
        >
          <meta.Icon className="h-3 w-3" />
          {meta.label}
        </span>
        <span className="font-mono-tech text-xs text-muted-foreground">
          {signal.filtersPassed}/{signal.filtersTotal} filtros
        </span>
      </header>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="font-orbitron text-lg font-bold text-foreground tracking-wider">
            {signal.asset}
          </p>
          <p className="font-mono-tech text-xs text-muted-foreground mt-1">
            Expira: {signal.expiry} · Entrada {signal.entryAt}
          </p>
        </div>
        <div
          className={`grid place-items-center h-14 w-14 rounded-2xl border ${
            isCall ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"
          } ${dirGlow}`}
        >
          <DirIcon className={`h-7 w-7 ${dirColor}`} />
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        {signal.filters.map((f) => (
          <div key={f.name} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{f.name}</span>
            <span
              className={`font-mono-tech font-semibold ${
                f.passed ? "text-success" : "text-muted-foreground/60"
              }`}
            >
              {f.passed ? "✓ OK" : "— skip"}
            </span>
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Confiança
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-prisma rounded-full"
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
          <span className={`font-mono-tech text-sm font-bold ${dirColor}`}>
            {signal.confidence}%
          </span>
        </div>
      </footer>
    </article>
  );
}
