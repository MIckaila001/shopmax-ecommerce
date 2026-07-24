"use client";

import { useEffect } from "react";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enregistre le Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW enregistre:", reg.scope))
        .catch((err) => console.error("SW erreur:", err));
    }
  }, []);

  return <>{children}</>;
}
