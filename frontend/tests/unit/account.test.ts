import { describe, it, expect } from "vitest";

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function maskCardNumber(card: string): string {
  // Garde les 4 derniers chiffres
  const cleaned = card.replace(/\s/g, "");
  if (cleaned.length < 4) return card;
  const last4 = cleaned.slice(-4);
  return `**** **** **** ${last4}`;
}

function filterOrders<T extends { status: string }>(
  orders: T[],
  filter: "all" | "processing" | "delivered" | "cancelled",
  search: string = ""
): T[] {
  return orders.filter((order) => {
    if (search && !JSON.stringify(order).toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (filter === "all") return true;
    if (filter === "processing") return order.status === "En cours de livraison";
    if (filter === "delivered") return order.status === "Livrée";
    if (filter === "cancelled") return order.status === "Annulée";
    return true;
  });
}

interface Address {
  id: number;
  isDefault: boolean;
}

function setDefaultAddress<T extends Address>(addresses: T[], id: number): T[] {
  return addresses.map((a) => ({ ...a, isDefault: a.id === id }));
}

describe("Account - getInitials", () => {
  it("retourne les initiales en majuscules", () => {
    expect(getInitials("Ismaila", "Bouba")).toBe("IB");
  });

  it("gère les noms vides", () => {
    expect(getInitials("", "Bouba")).toBe("B");
    expect(getInitials("Ismaila", "")).toBe("I");
  });
});

describe("Account - maskCardNumber", () => {
  it("masque une carte en gardant les 4 derniers", () => {
    expect(maskCardNumber("4242424242424242")).toBe("**** **** **** 4242");
  });

  it("gère une carte déjà formatée", () => {
    expect(maskCardNumber("4242 4242 4242 4242")).toBe("**** **** **** 4242");
  });

  it("retourne tel quel si trop court", () => {
    expect(maskCardNumber("123")).toBe("123");
  });
});

describe("Account - filterOrders", () => {
  const orders = [
    { id: "SMX-1", status: "Livrée" },
    { id: "SMX-2", status: "En cours de livraison" },
    { id: "SMX-3", status: "Annulée" },
    { id: "SMX-4", status: "Livrée" },
  ];

  it("'all' retourne tout", () => {
    expect(filterOrders(orders, "all")).toHaveLength(4);
  });

  it("'delivered' filtre les commandes livrées", () => {
    expect(filterOrders(orders, "delivered")).toHaveLength(2);
  });

  it("'processing' filtre les commandes en cours", () => {
    expect(filterOrders(orders, "processing")).toHaveLength(1);
  });

  it("'cancelled' filtre les commandes annulées", () => {
    expect(filterOrders(orders, "cancelled")).toHaveLength(1);
  });

  it("la recherche filtre par ID", () => {
    expect(filterOrders(orders, "all", "SMX-1")).toHaveLength(1);
  });
});

describe("Account - setDefaultAddress", () => {
  const addresses = [
    { id: 1, isDefault: true },
    { id: 2, isDefault: false },
    { id: 3, isDefault: false },
  ];

  it("met l'adresse sélectionnée par défaut", () => {
    const result = setDefaultAddress(addresses, 2);
    expect(result[0].isDefault).toBe(false);
    expect(result[1].isDefault).toBe(true);
    expect(result[2].isDefault).toBe(false);
  });

  it("si l'ID n'existe pas, aucune adresse n'est par défaut", () => {
    const result = setDefaultAddress(addresses, 99);
    expect(result.every((a) => !a.isDefault)).toBe(true);
  });
});
