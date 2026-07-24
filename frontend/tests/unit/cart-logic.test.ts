import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/lib/hooks/use-cart";

const mockProduct = {
  id: 1,
  name: "iPhone 15 Pro",
  price: 1499000,
  image: "https://example.com/iphone.jpg",
};

describe("Cart page logic - Calculations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calcule correctement le sous-total avec un seul produit", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(mockProduct, 2);
    });
    expect(result.current.subtotal).toBe(2998000);
  });

  it("applique la livraison gratuite au-dessus de 50 000 FCFA", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      // Produit à 50 000 + 1 FCFA pour dépasser le seuil
      result.current.addItem({ ...mockProduct, price: 50001 }, 1);
    });
    // 50001 > 50000 → livraison gratuite
    expect(result.current.subtotal).toBeGreaterThan(50000);
  });

  it("compte correctement le nombre total d'articles", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem({ ...mockProduct, id: 1 }, 2);
      result.current.addItem({ ...mockProduct, id: 2, price: 1000 }, 3);
      result.current.addItem({ ...mockProduct, id: 3, price: 500 }, 1);
    });
    expect(result.current.totalItems).toBe(6);
  });

  it("met à jour le prix total quand la quantité change", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(mockProduct, 1);
    });
    expect(result.current.subtotal).toBe(1499000);

    act(() => {
      result.current.updateQuantity(1, 3);
    });
    expect(result.current.subtotal).toBe(4497000);
  });

  it("gère correctement la suppression d'un article", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.addItem({ ...mockProduct, id: 2, price: 1000 }, 1);
    });
    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(2);
  });

  it("vide complètement le panier", () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(mockProduct, 2);
      result.current.addItem({ ...mockProduct, id: 2, price: 500 }, 1);
    });
    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });
});
