"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: POST /api/auth/forgot-password
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Link
        href="/connexion"
        className="inline-flex items-center text-sm text-gray-500 hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour à la connexion
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mot de passe oublié</h1>
        <p className="text-gray-500">
          Entrez votre email, nous vous enverrons un lien de réinitialisation
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        {isSent ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-bold text-lg mb-2">Email envoyé !</h2>
            <p className="text-sm text-gray-600 mb-6">
              Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous
              recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou réessayez.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSent(false);
                setEmail("");
              }}
            >
              Renvoyer l&apos;email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien de réinitialisation"
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link href="/connexion" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
