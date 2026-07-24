import { describe, it, expect } from "vitest";
import { products, categories } from "@/lib/data";

describe("Mock data - Products", () => {
  it("contient au moins un produit", () => {
    expect(products.length).toBeGreaterThan(0);
  });

  it("chaque produit a les propriétés requises", () => {
    products.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.price).toBeGreaterThan(0);
      expect(product.image).toBeDefined();
      expect(product.brand).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.rating).toBeGreaterThanOrEqual(0);
      expect(product.rating).toBeLessThanOrEqual(5);
    });
  });

  it("les IDs sont uniques", () => {
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("les prix sont réalistes (entre 1000 et 5 000 000 FCFA)", () => {
    products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(1000);
      expect(product.price).toBeLessThanOrEqual(5_000_000);
    });
  });

  it("les prix barrés sont supérieurs aux prix actuels", () => {
    products.forEach((product) => {
      if (product.oldPrice) {
        expect(product.oldPrice).toBeGreaterThan(product.price);
      }
    });
  });
});

describe("Mock data - Categories", () => {
  it("contient au moins une catégorie", () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  it("chaque catégorie a un slug valide", () => {
    categories.forEach((cat) => {
      expect(cat.slug).toMatch(/^[a-z0-9-]+$/);
    });
  });

  it("les slugs sont uniques", () => {
    const slugs = categories.map((c) => c.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("toutes les catégories référencées par les produits existent", () => {
    const categoryNames = categories.map((c) => c.name);
    products.forEach((product) => {
      expect(categoryNames).toContain(product.category);
    });
  });
});
