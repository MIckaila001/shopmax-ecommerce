"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth, type User } from "@/lib/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackSkeleton />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

function CallbackSkeleton() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-sm text-gray-500">Connexion en cours...</p>
      </div>
    </div>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateUser, hydrateFromStorage } = useAuth();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams?.get("token");
      const userParam = searchParams?.get("user");
      const redirect = searchParams?.get("redirect") || "/compte";
      const errorParam = searchParams?.get("error");

      // Gestion des erreurs
      if (errorParam) {
        setStatus("error");
        setError(getErrorMessage(errorParam));
        return;
      }

      if (!token || !userParam) {
        setStatus("error");
        setError("Paramètres manquants dans la réponse OAuth.");
        return;
      }

      try {
        // Parse le user
        const userData = JSON.parse(decodeURIComponent(userParam));

        // Construit l'objet User complet
        const user: User = {
          id: userData.id,
          firstName: userData.firstName || "Utilisateur",
          lastName: userData.lastName || "",
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          role: (userData.role as "Customer" | "Admin" | "Vendor") || "Customer",
        };

        // Stocke dans localStorage AVANT de rediriger
        const authData = { user, token };
        localStorage.setItem("shopmax_auth", JSON.stringify(authData));

        // Met a jour le state React
        updateUser(user);

        setStatus("success");

        // Attend 1.5 secondes pour etre sur que localStorage est ecrit
        // et que React a bien propage le state
        setTimeout(() => {
          // IMPORTANT : utiliser replace pour eviter de revenir au callback
          router.replace(redirect);
        }, 1500);
      } catch (err) {
        console.error("Erreur parsing callback:", err);
        setStatus("error");
        setError("Erreur lors de la finalisation de la connexion.");
      }
    };

    handleCallback();
  }, [searchParams, router, updateUser]);

  const getErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      access_denied: "Vous avez refusé l'accès à votre compte Google.",
      missing_params: "Paramètres OAuth manquants.",
      invalid_state: "Session expirée, veuillez réessayer.",
      token_exchange_failed: "Échec de l'échange avec Google.",
      userinfo_failed: "Impossible de récupérer votre profil Google.",
      auth_failed: "Échec de l'authentification.",
      internal_error: "Erreur interne du serveur.",
      google_not_configured: "Google OAuth n'est pas configurée sur le serveur.",
    };
    return messages[code] || `Erreur OAuth : ${code}`;
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
              <h2 className="text-lg font-bold">Connexion en cours...</h2>
              <p className="text-sm text-gray-500 mt-2">
                Finalisation de votre authentification Google
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <h2 className="text-lg font-bold">Connexion réussie !</h2>
              <p className="text-sm text-gray-500 mt-2">
                Redirection vers votre compte...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="text-lg font-bold mb-2">Échec de la connexion</h2>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <div className="flex flex-col gap-2">
                <Button asChild>
                  <a href="/connexion">Réessayer</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Retour à l&apos;accueil</a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
