import { describe, it, expect } from "vitest";
import { cn, formatPrice, getDiscountPercent, slugify, truncate } from "@/lib/utils";

describe("cn()", () => {
  it("merge les classes correctement", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("gère les classes conditionnelles", () => {
    const isActive = true;
    expect(cn("base", isActive && "active")).toBe("base active");
  });

  it("évite les doublons Tailwind", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatPrice()", () => {
  it("formate un prix en FCFA sans décimales", () => {
    // Utilise \u202f (espace fine insécable) comme séparateur de milliers en fr-FR
    expect(formatPrice(15000)).toBe("15\u202f000 FCFA");
  });

  it("gère les grands nombres", () => {
    expect(formatPrice(1499000)).toBe("1\u202f499\u202f000 FCFA");
  });

  it("accepte un prix en string", () => {
    expect(formatPrice("75000")).toBe("75\u202f000 FCFA");
  });

  it("gère le zéro", () => {
    expect(formatPrice(0)).toBe("0 FCFA");
  });

  it("contient bien le suffixe FCFA", () => {
    expect(formatPrice(5000)).toContain("FCFA");
  });
});

describe("getDiscountPercent()", () => {
  it("calcule une réduction correcte", () => {
    expect(getDiscountPercent(200, 100)).toBe(50);
  });

  it("retourne 0 si oldPrice est null", () => {
    expect(getDiscountPercent(0, 100)).toBe(0);
  });

  it("retourne 0 si oldPrice <= newPrice", () => {
    expect(getDiscountPercent(100, 200)).toBe(0);
    expect(getDiscountPercent(100, 100)).toBe(0);
  });

  it("arrondit correctement", () => {
    expect(getDiscountPercent(150, 100)).toBe(33);
  });
});

describe("slugify()", () => {
  it("convertit en minuscules", () => {
    expect(slugify("Bonjour")).toBe("bonjour");
  });

  it("remplace les espaces par des tirets", () => {
    expect(slugify("Bonjour le monde")).toBe("bonjour-le-monde");
  });

  it("supprime les accents", () => {
    expect(slugify("Électronique à domicile")).toBe("electronique-a-domicile");
  });

  it("supprime les caractères spéciaux", () => {
    expect(slugify("Hello @ World!")).toBe("hello-world");
  });

  it("gère les chaînes vides", () => {
    expect(slugify("")).toBe("");
  });
});

describe("truncate()", () => {
  it("tronque un texte trop long", () => {
    expect(truncate("Bonjour le monde", 10)).toBe("Bonjour le...");
  });

  it("laisse intact un texte plus court", () => {
    expect(truncate("Court", 10)).toBe("Court");
  });

  it("gère la limite exacte", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});
