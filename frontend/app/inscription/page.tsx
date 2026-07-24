"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithOAuth, isLoading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Force du mot de passe
  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (result.success) {
      router.push("/compte");
    } else {
      setError(result.error || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Créer un compte</h1>
        <p className="text-gray-500">
          Rejoignez-nous pour vivre une expérience culinaire exceptionnelle
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        {/* OAuth */}
        <div className="space-y-2">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full opacity-60"
              onClick={() => {
                setError("La connexion Google sera disponible bientot. Utilisez le formulaire ci-dessous pour creer votre compte.");
              }}
              disabled={isLoading}
            >
              <GoogleIcon className="h-4 w-4 mr-2" />
              Continuer avec Google
            </Button>
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Bientot
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => loginWithOAuth("facebook")}
            disabled={isLoading}
          >
            <FacebookIcon className="h-4 w-4 mr-2" />
            Continuer avec Facebook
          </Button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">ou</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Prénom</label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Ismaila"
                required
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Nom</label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Bouba"
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@exemple.com"
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">
              Téléphone <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+237 6 XX XX XX XX"
                className="pl-10"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 8 caractères"
                className="pl-10 pr-10"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password strength */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i <= passwordStrength.score
                          ? passwordStrength.color
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-500">
                  Force : {passwordStrength.label}
                </p>
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              className="rounded accent-primary mt-0.5"
              required
            />
            <span>
              J&apos;accepte les{" "}
              <Link href="/cgv" className="text-primary hover:underline">
                Conditions d&apos;utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/confidentialite" className="text-primary hover:underline">
                Politique de confidentialité
              </Link>
            </span>
          </label>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création du compte...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-primary font-semibold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}

// Helper : évaluation force du mot de passe
function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["", "Faible", "Moyen", "Bon", "Excellent"];
  const colors = ["bg-gray-300", "bg-destructive", "bg-warning", "bg-blue-500", "bg-success"];

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)] || "",
    color: colors[Math.min(score, 4)] || "bg-gray-300",
  };
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
