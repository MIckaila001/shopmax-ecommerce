import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/lib/hooks/use-cart";

const mockProduct = {
  id: 1,
  name: "iPhone 15 Pro",
  price: 1499000,
  image: "https://example.com/iphone.jpg",
};

const mockProduct2 = {
  id: 2,
  name: "Samsung Galaxy S24",
  price: 1399000,
  image: "https://example.com/samsung.jpg",
};

describe("useCart()", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("démarre avec un panier vide", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("ajoute un produit au panier", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(1);
    expect(result.current.items[0].quantity).toBe(1);
  });

  it("incrémente la quantité si le produit existe déjà", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("supprime un produit du panier", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("met à jour la quantité d'un produit", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    act(() => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it("supprime le produit si la quantité tombe à 0", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    act(() => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("calcule correctement le total d'articles", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 2);
    });
    act(() => {
      result.current.addItem(mockProduct2, 3);
    });

    expect(result.current.totalItems).toBe(5);
  });

  it("calcule correctement le sous-total", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 2); // 1499000 * 2 = 2998000
    });
    act(() => {
      result.current.addItem(mockProduct2, 1); // 1399000 * 1 = 1399000
    });

    expect(result.current.subtotal).toBe(2998000 + 1399000);
  });

  it("vide le panier", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.addItem(mockProduct2, 1);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
  });

  it("récupère la quantité d'un produit spécifique", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 3);
    });

    expect(result.current.getItemQuantity(1)).toBe(3);
    expect(result.current.getItemQuantity(999)).toBe(0);
  });

  it("persiste dans localStorage", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    const stored = localStorage.getItem("shopmax_cart");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].quantity).toBe(2);
  });
});
