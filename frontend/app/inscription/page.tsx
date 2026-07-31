"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Check,
  Shield,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";

type Step = "email" | "code" | "info";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  // Etape actuelle
  const [step, setStep] = useState<Step>("email");

  // Donnees du formulaire
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]); // 6 chiffres
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    acceptTerms: false,
  });

  // States UI
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [codeResentCount, setCodeResentCount] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null); // Pour la demo (affiche le code)

  // Refs pour les inputs du code
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown pour le renvoi de code
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // ===== ETAPE 1 : ENVOI DU CODE =====
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Veuillez entrer un email valide.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/send-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setCodeSent(true);
        setStep("code");
        setResendCooldown(60); // 60s avant de pouvoir renvoyer
        // Pour la demo (backend pas deploye), le code est affiche
        if (data.demoCode) {
          setDemoCode(data.demoCode);
        }
        // Focus sur le premier input du code
        setTimeout(() => codeRefs.current[0]?.focus(), 100);
      } else {
        setError(data.message || "Erreur lors de l'envoi du code.");
      }
    } catch (err) {
      // Mode fallback (backend pas accessible) - on simule un code
      setCodeSent(true);
      setStep("code");
      setResendCooldown(60);
      setDemoCode("123456"); // Code de demo
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    }
  };

  // ===== ETAPE 2 : VERIFICATION DU CODE =====
  const handleCodeChange = (index: number, value: string) => {
    // Accepte seulement les chiffres
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus sur le suivant
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }

    // Auto-submit si tous les chiffres sont remplis
    if (newCode.every((c) => c !== "") && index === 5) {
      handleVerifyCode(newCode.join(""));
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async (codeString: string) => {
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          code: codeString,
        }),
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setStep("info");
      } else {
        setError(data.message || "Code invalide ou expiré.");
        setCode(["", "", "", "", "", ""]);
        codeRefs.current[0]?.focus();
      }
    } catch (err) {
      // Mode demo : si le code tape est "123456" on accepte
      if (codeString === "123456") {
        setStep("info");
      } else {
        setError("Code invalide. En mode demo, utilisez : 123456");
        setCode(["", "", "", "", "", ""]);
        codeRefs.current[0]?.focus();
      }
    }
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codeString = code.join("");
    if (codeString.length !== 6) {
      setError("Veuillez entrer les 6 chiffres du code.");
      return;
    }
    handleVerifyCode(codeString);
  };

  // ===== ETAPE 3 : CREATION DU COMPTE =====
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    const result = await register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: email,
      phone: form.phone || undefined,
      password: form.password,
    });

    if (result.success) {
      router.push("/compte");
    } else {
      setError(result.error || "Erreur lors de la création du compte.");
    }
  };

  const handleResendCode = () => {
    if (resendCooldown > 0) return;
    setCodeResentCount(codeResentCount + 1);
    setResendCooldown(60);
    // Re-trigger l'envoi
    handleSendCode({ preventDefault: () => {} } as React.FormEvent);
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Créer un compte</h1>
        <p className="text-gray-500">
          {step === "email" && "Commencez par entrer votre email"}
          {step === "code" && "Vérifiez votre email"}
          {step === "info" && "Complétez votre profil"}
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {(["email", "code", "info"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s
                  ? "bg-primary text-dark"
                  : (["email", "code", "info"].indexOf(step) > i)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {(["email", "code", "info"].indexOf(step) > i) ? (
                <Check className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < 2 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  (["email", "code", "info"].indexOf(step) > i)
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        {/* ===== ETAPE 1 : EMAIL ===== */}
        {step === "email" && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="text-center mb-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-gray-600">
                Nous vous enverrons un code de vérification à 6 chiffres
              </p>
            </div>

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

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le code
                  <Mail className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* ===== ETAPE 2 : CODE OTP ===== */}
        {step === "code" && (
          <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-gray-600">
                Code envoyé à <strong>{email}</strong>
              </p>
            </div>

            {/* CODE DE DEMO (visible en attendant le backend) */}
            {demoCode && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs font-semibold text-yellow-800 mb-1">
                  🧪 MODE DEMO
                </p>
                <p className="text-xs text-yellow-700">
                  Votre code de test : <strong className="text-lg">{demoCode}</strong>
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  (En production, ce code sera envoyé par email)
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium block mb-2 text-center">
                Entrez le code à 6 chiffres
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      codeRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive text-center">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier le code"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0}
                className="text-sm text-primary hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {resendCooldown > 0 ? (
                  <>Renvoyer le code dans {resendCooldown}s</>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 inline mr-1" />
                    Renvoyer le code
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode(["", "", "", "", "", ""]);
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="h-3 w-3" />
              Changer d'email
            </button>
          </form>
        )}

        {/* ===== ETAPE 3 : INFOS PERSONNELLES ===== */}
        {step === "info" && (
          <form onSubmit={handleCreateAccount} className="space-y-3">
            <div className="text-center mb-2">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                Email vérifié ✅ Maintenant, complétez votre profil
              </p>
            </div>

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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

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
                <Link
                  href="/confidentialite"
                  className="text-primary hover:underline"
                >
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
                  Création...
                </>
              ) : (
                "Créer mon compte"
              )}
            </Button>
          </form>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="text-primary font-semibold hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  if (pasted.length === 6) {
    // Remplir tous les inputs
    const event = new CustomEvent("paste-code", { detail: pasted });
    window.dispatchEvent(event);
  }
}

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
