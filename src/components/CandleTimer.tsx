import { useEffect, useState } from "react";
import { getCandleInfo, formatCountdown, TIMEFRAMES, type Timeframe } from "@/lib/smc";

export function CandleTimer({ timeframe }: { timeframe: Timeframe }) {
  const [info, setInfo] = useState(() => getCandleInfo(TIMEFRAMES[timeframe]));

  useEffect(() => {
    const id = setInterval(() => setInfo(getCandleInfo(TIMEFRAMES[timeframe])), 250);
    return () => clearInterval(id);
  }, [timeframe]);

  const urgent = info.remainingSec <= 5;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Vela Atual · {timeframe}
        </p>
        <span className="font-mono-tech text-[10px] text-muted-foreground">BRT</span>
      </div>

      <div className="flex items-end justify-between gap-2 mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Fecha em</p>
          <p
            className={`font-mono-tech text-3xl font-bold ${urgent ? "text-destructive animate-pulse-glow-destructive" : "text-prisma"}`}
          >
            {formatCountdown(info.remainingSec)}
          </p>
        </div>
        <div className="text-right space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Abre · Fecha
          </p>
          <p className="font-mono-tech text-xs text-foreground">{info.open}</p>
          <p className="font-mono-tech text-xs text-muted-foreground">{info.close}</p>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full bg-prisma transition-[width] duration-200"
          style={{ width: `${info.progress * 100}%` }}
        />
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground text-center font-mono-tech">
        Próxima entrada na abertura de {info.nextOpenAt}
      </p>
    </div>
  );
}
