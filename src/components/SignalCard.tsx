import {
  ArrowDownRight,
  ArrowUpRight,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Layers,
  Target,
  Trash2,
} from "lucide-react";
import type { SMCAnalysis } from "@/lib/smc";

const dirMeta = {
  CALL: {
    color: "text-success",
    border: "border-success/40",
    bg: "bg-success/10",
    glow: "animate-pulse-glow-success",
    Icon: ArrowUpRight,
  },
  PUT: {
    color: "text-destructive",
    border: "border-destructive/40",
    bg: "bg-destructive/10",
    glow: "animate-pulse-glow-destructive",
    Icon: ArrowDownRight,
  },
  AGUARDAR: {
    color: "text-muted-foreground",
    border: "border-border",
    bg: "bg-secondary",
    glow: "",
    Icon: Target,
  },
} as const;

export function SignalCard({ a, onDelete }: { a: SMCAnalysis; onDelete?: (id: string) => void }) {
  const m = dirMeta[a.sinal_final];
  const isManip = a.manipulacao_detectada;

  return (
    <article
      className={`relative animate-fade-in-up rounded-2xl border p-5 transition-colors space-y-4 ${
        isManip
          ? "border-warning/60 bg-warning/10 hover:border-warning"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(a.id)}
          aria-label="Excluir sinal"
          className="absolute top-3 right-3 z-10 grid place-items-center h-7 w-7 rounded-full border border-border bg-background/70 text-muted-foreground hover:text-destructive hover:border-destructive/60 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      <header className="flex items-center justify-between gap-2 flex-wrap pr-8">
        <div className="flex items-center gap-2">
          {isManip ? (
            <Badge tone="warning" Icon={Zap}>
              Manipulação · {a.tipo_manipulacao.replace("_", " ")}
            </Badge>
          ) : a.filtros_aprovados === 5 ? (
            <Badge tone="primary" Icon={ShieldCheck}>
              Sinal Quântico 5/5
            </Badge>
          ) : (
            <Badge tone="primary" Icon={ShieldCheck}>
              Sinal Filtrado
            </Badge>
          )}
          <span className="text-[10px] font-mono-tech text-muted-foreground">
            {a.broker} · {a.timeframe}
          </span>
        </div>
        <span className="font-mono-tech text-xs text-muted-foreground">
          {a.filtros_aprovados}/{a.filtros_total} filtros
        </span>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-orbitron text-lg font-bold text-foreground tracking-wider truncate">
            {a.asset}
          </p>
          <p className="font-mono-tech text-xs text-muted-foreground mt-1">
            Entrada na abertura · {a.entryAt} BRT
          </p>
        </div>
        <div
          className={`grid place-items-center h-16 w-16 rounded-2xl border ${m.border} ${m.bg} ${m.glow}`}
        >
          <m.Icon className={`h-8 w-8 ${m.color}`} />
          <span
            className={`absolute mt-[68px] text-[10px] font-orbitron font-bold tracking-widest ${m.color}`}
          >
            {a.sinal_final}
          </span>
        </div>
      </div>

      {/* SMC Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Cell k="Estrutura" v={a.estrutura} accent="primary" />
        <Cell k="Wyckoff" v={a.fase_wyckoff} />
        <Cell k="Movimento" v={a.ultimo_movimento} />
        <Cell
          k="BOS/CHoCH"
          v={a.bos_choch === "NENHUM" ? "—" : a.bos_choch.replace("_", " ")}
          accent={
            a.bos_choch.includes("BULLISH")
              ? "success"
              : a.bos_choch.includes("BEARISH")
                ? "destructive"
                : undefined
          }
        />
        <Cell
          k="Order Block"
          v={a.order_block}
          accent={
            a.order_block === "BULLISH"
              ? "success"
              : a.order_block === "BEARISH"
                ? "destructive"
                : undefined
          }
        />
        <Cell
          k="FVG"
          v={a.fvg}
          accent={
            a.fvg === "BULLISH" ? "success" : a.fvg === "BEARISH" ? "destructive" : undefined
          }
        />
        <Cell k="Padrão Vela" v={a.padrao_vela} />
        <Cell
          k="Vela Atual"
          v={a.vela_atual}
          accent={
            a.vela_atual === "BULLISH"
              ? "success"
              : a.vela_atual === "BEARISH"
                ? "destructive"
                : undefined
          }
        />
      </div>

      {/* Filtros */}
      <div className="space-y-1.5">
        {a.filtros_lista.map((f) => (
          <div key={f.nome} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{f.nome}</span>
            <span
              className={`font-mono-tech font-semibold ${f.aprovado ? "text-success" : "text-muted-foreground/50"}`}
            >
              {f.aprovado ? "✓ OK" : "— skip"}
            </span>
          </div>
        ))}
      </div>

      {/* Zonas */}
      <div className="rounded-2xl border border-border bg-background/50 p-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Layers className="h-3 w-3" />
          Zonas Ativas
        </div>
        {a.zonas.map((z, i) => (
          <p key={i} className="text-xs text-foreground/80">
            <span className="font-mono-tech text-accent">{z.tipo}</span>{" "}
            <span className="text-muted-foreground">·</span> {z.descricao}
          </p>
        ))}
      </div>

      {/* Manipulação alert */}
      {isManip && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-orbitron text-xs font-bold text-destructive uppercase tracking-widest">
              Alerta de Manipulação
            </p>
            <p className="text-xs text-foreground/80 mt-1">{a.alerta_manipulacao}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground italic border-l-2 border-primary/40 pl-3">
        {a.motivo}
      </p>
      <p className="text-[10px] font-mono-tech text-muted-foreground/70">{a.ciclo_atual}</p>

      <footer className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Confiança IA
        </span>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-28 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-prisma rounded-full"
              style={{ width: `${a.confianca}%` }}
            />
          </div>
          <span className={`font-mono-tech text-sm font-bold ${m.color}`}>{a.confianca}%</span>
        </div>
      </footer>
    </article>
  );
}

function Badge({
  children,
  Icon,
  tone,
}: {
  children: React.ReactNode;
  Icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "accent" | "destructive" | "warning";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary/15 text-primary border-primary/40"
      : tone === "accent"
        ? "bg-accent/15 text-accent border-accent/40"
        : tone === "warning"
          ? "bg-warning/20 text-warning border-warning/50"
          : "bg-destructive/15 text-destructive border-destructive/40";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-orbitron font-semibold uppercase tracking-widest ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function Cell({
  k,
  v,
  accent,
}: {
  k: string;
  v: string;
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
    <div className="rounded-xl border border-border bg-background/40 px-3 py-2">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{k}</p>
      <p className={`font-mono-tech text-xs font-semibold ${color} truncate`}>{v}</p>
    </div>
  );
}
