import { describe, it, expect } from "vitest";
import {
  calculateShipping,
  isValidEmail,
  isValidPhone,
  generateOrderNumber,
} from "@/lib/utils";

describe("Checkout - Shipping calculation", () => {
  it("applique 1500 FCFA pour livraison standard", () => {
    expect(calculateShipping(10000, "delivery")).toBe(1500);
  });

  it("offre la livraison gratuite au-dessus de 50 000 FCFA", () => {
    expect(calculateShipping(50001, "delivery")).toBe(0);
  });

  it("offre la livraison gratuite exactement à 50 000 FCFA", () => {
    expect(calculateShipping(50000, "delivery")).toBe(0);
  });

  it("facture 500 FCFA pour point relais", () => {
    expect(calculateShipping(10000, "pickup")).toBe(500);
  });

  it("point relais reste à 500 FCFA même au-dessus de 50 000", () => {
    expect(calculateShipping(100000, "pickup")).toBe(500);
  });
});

describe("Checkout - Order number generation", () => {
  it("commence par SMX-", () => {
    expect(generateOrderNumber()).toMatch(/^SMX-/);
  });

  it("contient la date du jour au format YYYYMMDD", () => {
    const orderNumber = generateOrderNumber();
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    expect(orderNumber).toContain(today);
  });

  it("contient un identifiant aléatoire de 6 caractères", () => {
    const orderNumber = generateOrderNumber();
    const parts = orderNumber.split("-");
    expect(parts[2]).toHaveLength(6);
  });

  it("génère des numéros uniques", () => {
    const numbers = new Set();
    for (let i = 0; i < 100; i++) {
      numbers.add(generateOrderNumber());
    }
    expect(numbers.size).toBeGreaterThan(95);
  });
});

describe("Checkout - Form validation", () => {
  it("valide un email correct", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name+tag@domain.co")).toBe(true);
  });

  it("rejette un email invalide", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
  });

  it("valide un numéro camerounais avec indicatif", () => {
    expect(isValidPhone("+237 6 12 34 56 78")).toBe(true);
    expect(isValidPhone("+237612345678")).toBe(true);
  });

  it("valide un numéro camerounais sans indicatif", () => {
    expect(isValidPhone("612345678")).toBe(true);
    expect(isValidPhone("6 12 34 56 78")).toBe(true);
  });

  it("rejette un numéro trop court", () => {
    expect(isValidPhone("61234")).toBe(false);
  });

  it("rejette un numéro qui ne commence pas par 6", () => {
    expect(isValidPhone("+237 7 12 34 56 78")).toBe(false);
  });
});
