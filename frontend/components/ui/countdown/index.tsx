"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  endsAt: string | Date;
  className?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Compte a rebours temps reel
 * Utilise le pattern "mounted" pour eviter l'hydratation
 * Le premier render affiche 00:00:00, puis se met a jour cote client
 */
export function Countdown({ endsAt, className = "", compact = false }: CountdownProps) {
  // Pour eviter l'erreur d'hydratation, on attend le mount cote client
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    function calculate(): TimeLeft {
      const target = new Date(endsAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setTimeLeft(calculate());

    const interval = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  // Pendant le SSR, on montre un placeholder
  if (!mounted) {
    if (compact) {
      return <span className={`font-mono text-sm text-gray-400 ${className}`}>--:--:--</span>;
    }
    return (
      <div className={`flex gap-1 ${className}`}>
        <Block value="--" label="j" />
        <Block value="--" label="h" />
        <Block value="--" label="m" />
        <Block value="--" label="s" />
      </div>
    );
  }

  // Cote client, on montre le vrai countdown
  if (compact) {
    return (
      <span className={`font-mono text-sm font-bold text-dark ${className}`}>
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {timeLeft.days > 0 && <Block value={String(timeLeft.days).padStart(2, "0")} label="j" />}
      <Block value={String(timeLeft.hours).padStart(2, "0")} label="h" />
      <Block value={String(timeLeft.minutes).padStart(2, "0")} label="m" />
      <Block value={String(timeLeft.seconds).padStart(2, "0")} label="s" />
    </div>
  );
}

function Block({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-dark text-white rounded-md font-mono font-bold text-center flex flex-col items-center justify-center min-w-[40px] py-1.5 px-1.5">
      <span className="text-sm">{value}</span>
      <span className="text-[9px] text-gray-400 mt-0.5">{label}</span>
    </div>
  );
}
