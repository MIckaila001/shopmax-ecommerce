"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_KEY = "shopmax-install-dismissed";
const INSTALLED_KEY = "shopmax-install-accepted";
const DISMISS_DAYS = 7; // Redemander apres 7 jours si l'utilisateur a ferme

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1) Deja installe ?
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: minimal-ui)").matches;
    setIsStandalone(standalone);

    if (standalone) return; // On est deja dans l'app, on n'affiche rien

    // 2) Deja accepte ?
    if (localStorage.getItem(INSTALLED_KEY) === "1") return;

    // 3) Deja refuse recemment ?
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    // 4) Detecte iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 5) Ecoute beforeinstallprompt (Android/Desktop)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Affiche apres 5s
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 6) iOS : on montre les instructions apres 5s (pas de prompt natif)
    if (iOS) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    // 7) Ecoute l'event appinstalled pour memoriser
    const installedHandler = () => {
      localStorage.setItem(INSTALLED_KEY, "1");
      setShowPrompt(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        localStorage.setItem(INSTALLED_KEY, "1");
        setShowPrompt(false);
      } else {
        // Refuse : on redemande dans 7 jours
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        setShowPrompt(false);
      }
    } catch (err) {
      console.error("Install prompt error:", err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setShowPrompt(false);
  };

  // Ne rien afficher dans ces cas
  if (isStandalone) return null;
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-white border-2 border-primary rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm">Installer ShopMax</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isIOS
                ? "Appuyez sur Partager puis 'Sur l'écran d'accueil'"
                : "Ajoutez l'app à votre écran d'accueil pour un accès rapide"}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {!isIOS && deferredPrompt && (
            <Button onClick={handleInstall} className="flex-1" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Installer
            </Button>
          )}
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className={!isIOS && deferredPrompt ? "" : "flex-1"}
          >
            Plus tard
          </Button>
        </div>
      </div>
    </div>
  );
}
