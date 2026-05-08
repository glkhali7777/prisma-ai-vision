import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { PrismaLogo } from "@/components/PrismaLogo";
import { Clock } from "@/components/Clock";
import { ControlPanel } from "@/components/ControlPanel";
import { SignalCard } from "@/components/SignalCard";
import { CandleTimer } from "@/components/CandleTimer";
import { HistoryLog } from "@/components/HistoryLog";
import {
  generateAnalysis,
  shouldDisplay,
  TIMEFRAMES,
  type Broker,
  type SMCAnalysis,
  type Timeframe,
  getCandleInfo,
} from "@/lib/smc";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PRISMA IA · Smart Money Concepts Engine" },
      {
        name: "description",
        content:
          "PRISMA IA — painel quântico de sinais SMC com BOS/CHoCH, Order Blocks, FVG, Wyckoff e detecção de manipulação em tempo real.",
      },
    ],
  }),
});

function Index() {
  const [active, setActive] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>("M1");
  const [broker, setBroker] = useState<Broker>("Quotex");
  const [signals, setSignals] = useState<SMCAnalysis[]>([]);
  const [history, setHistory] = useState<SMCAnalysis[]>([]);
  const [stats, setStats] = useState({
    generated: 0,
    displayed: 0,
    calls: 0,
    puts: 0,
    manipulations: 0,
  });
  const lastCandleId = useRef<number>(-1);

  const runAnalysis = useCallback(() => {
    const a = generateAnalysis(broker, timeframe);
    setStats((p) => ({
      ...p,
      generated: p.generated + 1,
      manipulations: p.manipulations + (a.manipulacao_detectada ? 1 : 0),
    }));
    setHistory((p) => [a, ...p].slice(0, 30));
    if (shouldDisplay(a)) {
      setSignals((p) => [a, ...p].slice(0, 6));
      setStats((p) => ({
        ...p,
        displayed: p.displayed + 1,
        calls: p.calls + (a.sinal_final === "CALL" ? 1 : 0),
        puts: p.puts + (a.sinal_final === "PUT" ? 1 : 0),
      }));
    }
  }, [broker, timeframe]);

  // Watch candle openings — analyze on the open of each new candle
  useEffect(() => {
    if (!active) return;
    lastCandleId.current = -1;
    const id = setInterval(() => {
      const info = getCandleInfo(TIMEFRAMES[timeframe]);
      if (info.candleId !== lastCandleId.current && info.isNewCandle) {
        lastCandleId.current = info.candleId;
        runAnalysis();
      }
    }, 500);
    return () => clearInterval(id);
  }, [active, timeframe, runAnalysis]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <PrismaLogo />
          <Clock />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="sr-only">PRISMA IA — Painel SMC de Sinais</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              active={active}
              onToggle={() => setActive((a) => !a)}
              onAnalyze={runAnalysis}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              broker={broker}
              setBroker={setBroker}
              stats={stats}
            />
            <CandleTimer timeframe={timeframe} />
            <HistoryLog items={history} />
          </div>

          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Smart Money Concepts · Tempo real
                </p>
                <h2 className="font-orbitron text-xl font-bold text-foreground mt-1">
                  Sinais Confirmados
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {signals.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSignals([])}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-orbitron uppercase tracking-widest text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
                  >
                    Limpar tudo
                  </button>
                )}
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow-success" />
                  <span className="font-mono-tech">live</span>
                </span>
              </div>
            </div>

            {signals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <p className="font-orbitron text-sm text-muted-foreground">
                  Aguardando confluência mínima de 4/5 filtros SMC...
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono-tech">
                  PRISMA IA descarta sinais fracos · alertas de manipulação sempre passam
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {signals.map((s, i) => (
                  <SignalCard
                    key={s.id}
                    a={s}
                    isLatest={i === 0}
                    onDelete={(id) => setSignals((p) => p.filter((x) => x.id !== id))}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1.5 text-xs">
            <Lock className="h-3 w-3 text-success" />
            <span className="font-orbitron font-semibold tracking-widest text-success uppercase text-[10px]">
              SSL Secured · Conexão Criptografada
            </span>
          </span>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            PRISMA IA © 2026 · Quantum SMC Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
