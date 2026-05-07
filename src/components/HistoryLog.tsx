import { ScrollText } from "lucide-react";
import type { SMCAnalysis } from "@/lib/smc";

export function HistoryLog({ items }: { items: SMCAnalysis[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <ScrollText className="h-4 w-4 text-primary" />
        <h3 className="font-orbitron text-sm font-bold uppercase tracking-widest text-foreground">
          Log da Sessão
        </h3>
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 font-mono-tech text-[11px]">
        {items.length === 0 && (
          <p className="text-muted-foreground italic">Aguardando primeiro sinal...</p>
        )}
        {items.map((it) => {
          const time = new Date(it.createdAt).toLocaleTimeString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour12: false,
          });
          const color =
            it.sinal_final === "CALL"
              ? "text-success"
              : it.sinal_final === "PUT"
                ? "text-destructive"
                : "text-muted-foreground";
          return (
            <div key={it.id} className="flex items-center gap-2 border-b border-border/50 pb-1">
              <span className="text-muted-foreground">{time}</span>
              <span className="text-accent">{it.broker.slice(0, 3).toUpperCase()}</span>
              <span className="text-foreground">{it.timeframe}</span>
              <span className="text-foreground/80 truncate flex-1">{it.asset}</span>
              <span className={`font-bold ${color}`}>
                {it.sinal_final} {it.confianca}%
              </span>
              {it.manipulacao_detectada && <span className="text-accent">⚠</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
