"use client";

import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-md text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <WifiOff className="h-10 w-10 text-gray-400" />
      </div>

      <h1 className="text-2xl font-bold mb-2">Vous êtes hors ligne</h1>
      <p className="text-gray-500 mb-6">
        Pas de connexion internet. Vérifiez votre réseau et réessayez.
      </p>

      <div className="flex flex-col gap-2">
        <Button onClick={handleRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}
