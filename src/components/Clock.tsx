import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5">
      <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow-success" />
      <div className="flex flex-col leading-tight">
        <span className="font-mono-tech text-base md:text-lg font-bold text-foreground tracking-wider">
          {time || "--:--:--"}
        </span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
          Brasília · GMT-3
        </span>
      </div>
    </div>
  );
}
