import { describe, it, expect } from "vitest";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered";

const STATUS_STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: "pending", label: "Commandée" },
  { key: "confirmed", label: "Confirmée" },
  { key: "processing", label: "En préparation" },
  { key: "shipped", label: "Expédiée" },
  { key: "delivered", label: "En cours de livraison" },
];

function getCurrentStepIndex(status: OrderStatus): number {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

function generateTrackingNumber(): string {
  return `AME-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

function simulateStatusFromRef(ref: string): OrderStatus {
  const hash = ref.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
  return statuses[hash % statuses.length];
}

function isValidOrderNumber(ref: string): boolean {
  return /^SMX-\d{8}-[A-Z0-9]{6}$/.test(ref);
}

describe("Tracking - Status steps", () => {
  it("5 étapes au total", () => {
    expect(STATUS_STEPS).toHaveLength(5);
  });

  it("la première étape est 'pending'", () => {
    expect(STATUS_STEPS[0].key).toBe("pending");
  });

  it("la dernière étape est 'delivered'", () => {
    expect(STATUS_STEPS[4].key).toBe("delivered");
  });
});

describe("Tracking - getCurrentStepIndex", () => {
  it("retourne 0 pour pending", () => {
    expect(getCurrentStepIndex("pending")).toBe(0);
  });

  it("retourne 2 pour processing", () => {
    expect(getCurrentStepIndex("processing")).toBe(2);
  });

  it("retourne 4 pour delivered", () => {
    expect(getCurrentStepIndex("delivered")).toBe(4);
  });

  it("retourne -1 pour un statut inconnu", () => {
    expect(getCurrentStepIndex("unknown" as OrderStatus)).toBe(-1);
  });
});

describe("Tracking - generateTrackingNumber", () => {
  it("commence par AME-", () => {
    expect(generateTrackingNumber()).toMatch(/^AME-/);
  });

  it("contient 8 caractères après AME-", () => {
    const number = generateTrackingNumber();
    const suffix = number.replace("AME-", "");
    expect(suffix).toHaveLength(8);
  });

  it("génère des numéros uniques", () => {
    const numbers = new Set();
    for (let i = 0; i < 100; i++) {
      numbers.add(generateTrackingNumber());
    }
    expect(numbers.size).toBeGreaterThan(95);
  });
});

describe("Tracking - simulateStatusFromRef", () => {
  it("retourne toujours un statut valide", () => {
    const refs = [
      "SMX-20240524-ABC123",
      "SMX-20240601-XYZ789",
      "SMX-20240515-DEF456",
    ];
    refs.forEach((ref) => {
      const status = simulateStatusFromRef(ref);
      expect(["pending", "confirmed", "processing", "shipped", "delivered"]).toContain(status);
    });
  });

  it("produit le même statut pour le même ref", () => {
    const ref = "SMX-20240524-ABC123";
    expect(simulateStatusFromRef(ref)).toBe(simulateStatusFromRef(ref));
  });
});

describe("Tracking - isValidOrderNumber", () => {
  it("valide un numéro de commande correct", () => {
    expect(isValidOrderNumber("SMX-20240524-ABC123")).toBe(true);
    expect(isValidOrderNumber("SMX-20241231-XYZ789")).toBe(true);
  });

  it("rejette un format incorrect", () => {
    expect(isValidOrderNumber("12345")).toBe(false);
    expect(isValidOrderNumber("SMX-20240524-AB")).toBe(false); // Trop court
    expect(isValidOrderNumber("SMX-2024-ABC123")).toBe(false); // Date courte
    expect(isValidOrderNumber("ABC-20240524-ABC123")).toBe(false); // Mauvais préfixe
  });

  it("rejette les chaînes vides", () => {
    expect(isValidOrderNumber("")).toBe(false);
  });
});
