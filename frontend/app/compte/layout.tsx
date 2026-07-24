"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { AccountSidebar } from "@/components/account/sidebar";
import { Loader2 } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, hydrateFromStorage } = useAuth();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  // Force l'hydratation depuis localStorage au montage
  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  // Redirige SEULEMENT si on a vraiment pas d'auth apres hydratation
  useEffect(() => {
    // Attendre la fin de l'hydratation + le loading initial
    if (!hydrated || isLoading) return;
    // Delai de 200ms pour laisser le state se stabiliser
    const timeout = setTimeout(() => {
      if (!isAuthenticated) {
        router.push("/connexion?redirect=/compte");
      }
    }, 200);
    return () => clearTimeout(timeout);
  }, [hydrated, isLoading, isAuthenticated, router]);

  // Pendant l'hydratation ou le loading : afficher un loader
  if (!hydrated || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-3 text-sm text-gray-500">Chargement...</p>
      </div>
    );
  }

  // Si pas authentifie apres hydratation, ne rien afficher (la redirection est en cours)
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-3 text-sm text-gray-500">Redirection vers la connexion...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <AccountSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
