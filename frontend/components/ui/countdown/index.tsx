"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  endsAt: string | Date;
  className?: string;
  variant?: "default" | "compact" | "large";
  onExpire?: () => void;
  showLabels?: boolean;
}

/**
 * Compte à rebours temps réel qui se met à jour chaque seconde.
 * @param endsAt - Date de fin (ISO string ou Date)
 * @param variant - default | compact | large
 * @param onExpire - Callback quand le temps est écoulé
 */
export function Countdown({
  endsAt,
  className = "",
  variant = "default",
  onExpire,
  showLabels = true,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endsAt));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date(endsAt).getTime();

    // Mise à jour immédiate
    update();

    // Mise à jour chaque seconde
    const interval = setInterval(update, 1000);

    function update() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        onExpire?.();
        return;
      }

      setTimeLeft(calculateTimeLeft(endsAt));
    }

    return () => clearInterval(interval);
  }, [endsAt, onExpire]);

  if (isExpired) {
    return (
      <div className={`text-red-500 font-semibold ${className}`}>
        Offre expirée
      </div>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  // Variantes de style
  if (variant === "compact") {
    return (
      <span className={`font-mono text-sm ${className}`}>
        {String(hours).padStart(2, "0")}:
        {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </span>
    );
  }

  if (variant === "large") {
    return (
      <div className={`flex gap-2 ${className}`}>
        <TimeBlock value={days} label="jours" large />
        <TimeBlock value={hours} label="h" large />
        <TimeBlock value={minutes} label="min" large />
        <TimeBlock value={seconds} label="sec" large />
      </div>
    );
  }

  // Default
  return (
    <div className={`flex gap-1 ${className}`}>
      {days > 0 && <TimeBlock value={days} label="j" showLabel={showLabels} />}
      <TimeBlock value={hours} label="h" showLabel={showLabels} />
      <TimeBlock value={minutes} label="m" showLabel={showLabels} />
      <TimeBlock value={seconds} label="s" showLabel={showLabels} />
    </div>
  );
}

function TimeBlock({
  value,
  label,
  large = false,
  showLabel = true,
}: {
  value: number;
  label: string;
  large?: boolean;
  showLabel?: boolean;
}) {
  const sizeClasses = large ? "min-w-[60px] py-3 px-2" : "min-w-[40px] py-1.5 px-1.5";
  const valueClasses = large ? "text-2xl" : "text-sm";
  const labelClasses = large ? "text-[10px]" : "text-[9px]";

  return (
    <div
      className={`bg-dark text-white rounded-md font-mono font-bold text-center flex flex-col items-center justify-center ${sizeClasses}`}
    >
      <span className={valueClasses}>{String(value).padStart(2, "0")}</span>
      {showLabel && <span className={`${labelClasses} text-gray-400 mt-0.5`}>{label}</span>}
    </div>
  );
}

function calculateTimeLeft(endsAt: string | Date) {
  const targetDate = new Date(endsAt).getTime();
  const now = Date.now();
  const diff = Math.max(0, targetDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}
