import { describe, it, expect } from "vitest";
import { mapApiProductToProduct } from "@/lib/api-client";

describe("mapApiProductToProduct", () => {
  it("mappe un produit API en produit front", () => {
    const apiProduct = {
      id: 1,
      name: "iPhone 15 Pro",
      description: "Description",
      price: 1499000,
      oldPrice: 1799000,
      stock: 10,
      imageUrl: "https://example.com/iphone.jpg",
      brand: "Apple",
      color: "Noir",
      categoryId: 1,
      category: { id: 1, name: "Électronique", slug: "electronique" },
      rating: 4.8,
      reviewsCount: 100,
      isFeatured: true,
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };

    const product = mapApiProductToProduct(apiProduct);

    expect(product.id).toBe(1);
    expect(product.name).toBe("iPhone 15 Pro");
    expect(product.image).toBe("https://example.com/iphone.jpg");
    expect(product.category).toBe("Électronique");
    expect(product.oldPrice).toBe(1799000);
    expect(product.inStock).toBe(true);
  });

  it("calcule le badge de réduction si oldPrice existe", () => {
    const apiProduct = {
      id: 1,
      name: "Test",
      description: "",
      price: 100,
      oldPrice: 200,
      stock: 5,
      imageUrl: "",
      brand: "Brand",
      color: "",
      categoryId: 1,
      rating: 4,
      reviewsCount: 0,
      isFeatured: false,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    };

    const product = mapApiProductToProduct(apiProduct);
    expect(product.badge).toBe("-50%");
  });

  it("met le badge NEW si le produit est featured", () => {
    const apiProduct = {
      id: 1,
      name: "Test",
      description: "",
      price: 100,
      stock: 5,
      imageUrl: "",
      brand: "Brand",
      color: "",
      categoryId: 1,
      rating: 4,
      reviewsCount: 0,
      isFeatured: true,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    };

    const product = mapApiProductToProduct(apiProduct);
    expect(product.badge).toBe("NEW");
  });

  it("indique 'inStock' à false si stock = 0", () => {
    const apiProduct = {
      id: 1,
      name: "Test",
      description: "",
      price: 100,
      stock: 0,
      imageUrl: "",
      brand: "Brand",
      color: "",
      categoryId: 1,
      rating: 4,
      reviewsCount: 0,
      isFeatured: false,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    };

    const product = mapApiProductToProduct(apiProduct);
    expect(product.inStock).toBe(false);
  });

  it("gère un produit sans catégorie", () => {
    const apiProduct = {
      id: 1,
      name: "Test",
      description: "",
      price: 100,
      stock: 5,
      imageUrl: "",
      brand: "Brand",
      color: "",
      categoryId: 1,
      rating: 4,
      reviewsCount: 0,
      isFeatured: false,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    };

    const product = mapApiProductToProduct(apiProduct);
    expect(product.category).toBe("Autre");
  });
});
