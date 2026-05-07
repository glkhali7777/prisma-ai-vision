import { Activity, Power, Radio, Sparkles } from "lucide-react";

interface Props {
  active: boolean;
  onToggle: () => void;
  stats: { generated: number; displayed: number; wins: number; losses: number };
}

export function ControlPanel({ active, onToggle, stats }: Props) {
  const winRate =
    stats.wins + stats.losses === 0
      ? 0
      : Math.round((stats.wins / (stats.wins + stats.losses)) * 100);

  return (
    <aside className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
          Núcleo de Análise
        </p>
        <h2 className="font-orbitron text-xl font-bold text-foreground">Painel de Controle</h2>
      </div>

      <button
        onClick={onToggle}
        className={`w-full rounded-2xl px-5 py-4 font-orbitron text-sm font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
          active
            ? "bg-prisma text-white glow-primary animate-pulse-glow"
            : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
        }`}
      >
        <Power className="h-4 w-4" />
        {active ? "IA Ativa · Analisando" : "Ativar PRISMA IA"}
      </button>

      <div className="grid grid-cols-2 gap-3">
        <Stat icon={Radio} label="Gerados" value={stats.generated} />
        <Stat icon={Sparkles} label="Exibidos" value={stats.displayed} />
        <Stat icon={Activity} label="Wins" value={stats.wins} accent="success" />
        <Stat icon={Activity} label="Loss" value={stats.losses} accent="destructive" />
      </div>

      <div className="rounded-2xl border border-border bg-background/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Assertividade
          </span>
          <span className="font-mono-tech text-lg font-bold text-prisma">{winRate}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-prisma rounded-full transition-all duration-700"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <p className="flex items-center justify-between">
          <span>Estratégia</span>
          <span className="font-mono-tech text-foreground">Quantum 5/5</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Filtros mínimos</span>
          <span className="font-mono-tech text-foreground">4 de 5</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Modo manipulação</span>
          <span className="font-mono-tech text-accent">Ativo</span>
        </p>
        <p className="flex items-center justify-between">
          <span>Latência</span>
          <span className="font-mono-tech text-success">12ms</span>
        </p>
      </div>
    </aside>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: "success" | "destructive";
}) {
  const color =
    accent === "success"
      ? "text-success"
      : accent === "destructive"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-background/50 p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-widest mb-1">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className={`font-mono-tech text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
