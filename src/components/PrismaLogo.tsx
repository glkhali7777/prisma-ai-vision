export function PrismaLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative grid place-items-center rounded-2xl bg-card border border-border glow-primary animate-pulse-glow"
        style={{ width: size + 16, height: size + 16 }}
      >
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="PRISMA IA">
          <defs>
            <linearGradient id="prismaGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="hsl(292 84% 61%)" />
              <stop offset="100%" stopColor="hsl(263 70% 66%)" />
            </linearGradient>
          </defs>
          <path
            d="M24 4 L44 40 L4 40 Z"
            stroke="url(#prismaGrad)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 4 L24 40"
            stroke="hsl(263 70% 66%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M14 22 L34 22"
            stroke="hsl(292 84% 61%)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-orbitron text-xl md:text-2xl font-extrabold tracking-wider text-prisma">
          PRISMA IA
        </span>
        <span className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">
          Quantum Signal Engine
        </span>
      </div>
    </div>
  );
}
