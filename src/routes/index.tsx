import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { PrismaLogo } from "@/components/PrismaLogo";
import { Clock } from "@/components/Clock";
import { ControlPanel } from "@/components/ControlPanel";
import { SignalCard } from "@/components/SignalCard";
import { generateCandidate, shouldDisplay, type Signal } from "@/lib/signals";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "PRISMA IA · Painel Quântico de Sinais" },
      {
        name: "description",
        content:
          "PRISMA IA — painel de inteligência artificial para sinais de trading com 5 filtros de confluência, detecção de manipulação e alertas em tempo real.",
      },
    ],
  }),
});

function Index() {
  const [active, setActive] = useState(true);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState({ generated: 0, displayed: 0, wins: 0, losses: 0 });
  const tick = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const s = generateCandidate();
      tick.current += 1;
      setStats((p) => ({ ...p, generated: p.generated + 1 }));
      if (shouldDisplay(s)) {
        setSignals((prev) => [s, ...prev].slice(0, 8));
        setStats((p) => {
          const won = Math.random() > 0.28;
          return {
            ...p,
            displayed: p.displayed + 1,
            wins: p.wins + (won ? 1 : 0),
            losses: p.losses + (won ? 0 : 1),
          };
        });
      }
    }, 4500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
          <PrismaLogo />
          <Clock />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="sr-only">PRISMA IA — Painel de Sinais</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ControlPanel
              active={active}
              onToggle={() => setActive((a) => !a)}
              stats={stats}
            />
          </div>

          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Fluxo em tempo real
                </p>
                <h2 className="font-orbitron text-xl font-bold text-foreground mt-1">
                  Sinais Confirmados
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow-success" />
                <span className="font-mono-tech">live</span>
              </span>
            </div>

            {signals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <p className="font-orbitron text-sm text-muted-foreground">
                  Aguardando confluência mínima de 4/5 filtros...
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono-tech">
                  PRISMA IA descarta sinais fracos automaticamente
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {signals.map((s) => (
                  <SignalCard key={s.id} signal={s} />
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
            PRISMA IA © 2026 · Quantum Signal Engine
          </p>
        </div>
      </footer>
    </div>
  );
}
