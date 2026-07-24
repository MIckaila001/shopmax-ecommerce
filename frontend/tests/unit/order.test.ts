import { describe, it, expect } from "vitest";

const PAYMENT_LABELS: Record<string, string> = {
  MTN: "MTN Mobile Money",
  Orange: "Orange Money",
  Visa: "Carte Visa",
  Mastercard: "Mastercard",
  CashOnDelivery: "Paiement à la livraison",
};

function formatOrderDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getShippingLabel(method: string): string {
  return method === "delivery" ? "À domicile" : "Point relais";
}

function calculateItemTotal(price: number, quantity: number): number {
  return price * quantity;
}

describe("Order confirmation - Date formatting", () => {
  it("formate une date ISO en français", () => {
    const formatted = formatOrderDate("2024-05-24T14:30:00Z");
    expect(formatted).toContain("2024");
    expect(formatted).toContain("mai");
  });

  it("inclut l'heure", () => {
    const formatted = formatOrderDate("2024-05-24T14:30:00Z");
    expect(formatted).toMatch(/\d{2}:\d{2}/);
  });
});

describe("Order confirmation - Payment labels", () => {
  it("traduit MTN", () => {
    expect(PAYMENT_LABELS.MTN).toBe("MTN Mobile Money");
  });

  it("traduit Orange", () => {
    expect(PAYMENT_LABELS.Orange).toBe("Orange Money");
  });

  it("traduit paiement à la livraison", () => {
    expect(PAYMENT_LABELS.CashOnDelivery).toBe("Paiement à la livraison");
  });

  it("a une entrée pour chaque méthode supportée", () => {
    expect(Object.keys(PAYMENT_LABELS)).toHaveLength(5);
  });
});

describe("Order confirmation - Shipping label", () => {
  it("affiche 'À domicile' pour delivery", () => {
    expect(getShippingLabel("delivery")).toBe("À domicile");
  });

  it("affiche 'Point relais' pour pickup", () => {
    expect(getShippingLabel("pickup")).toBe("Point relais");
  });
});

describe("Order confirmation - Items total", () => {
  it("calcule le total d'un article", () => {
    expect(calculateItemTotal(1499000, 2)).toBe(2998000);
  });

  it("retourne 0 pour quantité 0", () => {
    expect(calculateItemTotal(1000, 0)).toBe(0);
  });

  it("gère les grands nombres", () => {
    expect(calculateItemTotal(1499000, 5)).toBe(7495000);
  });
});

describe("Order confirmation - Email validation", () => {
  function maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;
    const visible = user.slice(0, 2);
    return `${visible}***@${domain}`;
  }

  it("masque un email pour la confidentialité", () => {
    expect(maskEmail("ismaila@gmail.com")).toBe("is***@gmail.com");
  });

  it("gère les emails courts", () => {
    expect(maskEmail("ab@test.com")).toBe("ab***@test.com");
  });
});
