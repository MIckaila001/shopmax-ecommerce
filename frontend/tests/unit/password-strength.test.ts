import { describe, it, expect } from "vitest";

type Strength = {
  score: number;
  label: string;
  color: string;
};

function getPasswordStrength(password: string): Strength {
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

describe("Password strength", () => {
  it("retourne score 0 pour un mot de passe vide", () => {
    const s = getPasswordStrength("");
    expect(s.score).toBe(0);
  });

  it("retourne score 0 pour un mot de passe trop court (< 8 chars)", () => {
    const s = getPasswordStrength("abc");
    expect(s.score).toBe(0);
  });

  it("retourne score 1 pour 'password' (8 chars, lowercase only)", () => {
    const s = getPasswordStrength("password");
    expect(s.score).toBe(1);
    expect(s.label).toBe("Faible");
  });

  it("retourne score 2 pour un mot de passe 8+ chars avec majuscules", () => {
    const s = getPasswordStrength("Password");
    expect(s.score).toBe(2);
    expect(s.label).toBe("Moyen");
  });

  it("retourne score 3 pour 12+ chars avec majuscules et minuscules", () => {
    const s = getPasswordStrength("MyLongPassword");
    expect(s.score).toBe(3);
  });

  it("retourne score 4 pour un mot de passe très fort", () => {
    const s = getPasswordStrength("MyStr0ng!Pass");
    expect(s.score).toBe(4);
    expect(s.label).toBe("Excellent");
  });

  it("la couleur correspond au score", () => {
    expect(getPasswordStrength("password").color).toBe("bg-destructive");
    expect(getPasswordStrength("MyStr0ng!Pass").color).toBe("bg-success");
  });

  it("plafonne le score à 4", () => {
    const s = getPasswordStrength("MyV3ryL0ng!Str0ng!P@ssw0rd");
    expect(s.score).toBeLessThanOrEqual(4);
  });
});
