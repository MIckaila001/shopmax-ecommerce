import { describe, it, expect } from "vitest";

// =====================================================
// Tests de la logique OAuth Google
// =====================================================

interface GoogleUserInfo {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
}

function parseNamesFromGoogle(googleUser: GoogleUserInfo): { firstName: string; lastName: string } {
  // Si on a déjà les noms séparés
  if (googleUser.givenName || googleUser.familyName) {
    return {
      firstName: googleUser.givenName || "Utilisateur",
      lastName: googleUser.familyName || "Google",
    };
  }

  // Sinon on split le nom complet
  if (googleUser.name) {
    const parts = googleUser.name.split(" ", 2);
    return {
      firstName: parts[0] || "Utilisateur",
      lastName: parts.length > 1 ? parts[1] : "Google",
    };
  }

  // Fallback
  return { firstName: "Utilisateur", lastName: "Google" };
}

function buildGoogleAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  const scope = "openid email profile";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    state,
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

function parseState(state: string): { token: string; redirect: string } | null {
  const parts = state.split("|", 2);
  if (parts.length < 2) return null;
  return {
    token: parts[0],
    redirect: decodeURIComponent(parts[1]),
  };
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    access_denied: "Vous avez refusé l'accès à votre compte Google.",
    missing_params: "Paramètres OAuth manquants.",
    invalid_state: "Session expirée, veuillez réessayer.",
    token_exchange_failed: "Échec de l'échange avec Google.",
    userinfo_failed: "Impossible de récupérer votre profil Google.",
    auth_failed: "Échec de l'authentification.",
    internal_error: "Erreur interne du serveur.",
  };
  return messages[code] || `Erreur OAuth : ${code}`;
}

describe("Google OAuth - parseNamesFromGoogle", () => {
  it("utilise givenName et familyName s'ils existent", () => {
    const result = parseNamesFromGoogle({
      id: "123",
      email: "test@gmail.com",
      emailVerified: true,
      givenName: "Ismaila",
      familyName: "Bouba",
    });
    expect(result).toEqual({ firstName: "Ismaila", lastName: "Bouba" });
  });

  it("split le nom complet si pas de givenName/familyName", () => {
    const result = parseNamesFromGoogle({
      id: "123",
      email: "test@gmail.com",
      emailVerified: true,
      name: "John Doe",
    });
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });

  it("gère un nom simple", () => {
    const result = parseNamesFromGoogle({
      id: "123",
      email: "test@gmail.com",
      emailVerified: true,
      name: "Madonna",
    });
    expect(result).toEqual({ firstName: "Madonna", lastName: "Google" });
  });

  it("fallback si rien n'est fourni", () => {
    const result = parseNamesFromGoogle({
      id: "123",
      email: "test@gmail.com",
      emailVerified: true,
    });
    expect(result).toEqual({ firstName: "Utilisateur", lastName: "Google" });
  });
});

describe("Google OAuth - buildGoogleAuthUrl", () => {
  it("construit une URL valide", () => {
    const url = buildGoogleAuthUrl(
      "test-client-id",
      "http://localhost:5000/callback",
      "state-123"
    );

    expect(url).toContain("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url).toContain("client_id=test-client-id");
    expect(url).toContain("response_type=code");
    expect(url).toContain("scope=openid+email+profile");
    expect(url).toContain("state=state-123");
  });
});

describe("Google OAuth - parseState", () => {
  it("parse un state avec redirect", () => {
    const result = parseState("abc-123|/compte");
    expect(result).toEqual({
      token: "abc-123",
      redirect: "/compte",
    });
  });

  it("décode les URLs encodées", () => {
    const result = parseState("abc-123|%2Fcompte%2Fprofil");
    expect(result?.redirect).toBe("/compte/profil");
  });

  it("retourne null si format invalide", () => {
    expect(parseState("invalid")).toBeNull();
    expect(parseState("")).toBeNull();
  });
});

describe("Google OAuth - getErrorMessage", () => {
  it("retourne un message pour access_denied", () => {
    expect(getErrorMessage("access_denied")).toContain("refusé");
  });

  it("retourne un message pour token_exchange_failed", () => {
    expect(getErrorMessage("token_exchange_failed")).toContain("échange");
  });

  it("retourne un message par défaut pour un code inconnu", () => {
    expect(getErrorMessage("unknown_code")).toContain("unknown_code");
  });
});
