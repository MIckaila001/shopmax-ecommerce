"use client";

import { useFetch } from "./use-fetch";
import { productsApi, categoriesApi, mapApiProductToProduct, type ProductsQuery } from "@/lib/api-client";
import type { Product } from "@/lib/data";

export function useProducts(query: ProductsQuery = {}) {
  const result = useFetch(
    async () => {
      try {
        const { items } = await productsApi.list(query);
        return items.map(mapApiProductToProduct);
      } catch (error) {
        // En cas d'erreur (backend down), fallback sur les mocks
        console.warn("API indisponible, fallback sur les mocks:", error);
        return [];
      }
    },
    [JSON.stringify(query)]
  );

  return result;
}

export function useProduct(id: number) {
  return useFetch(
    async () => {
      try {
        const apiProduct = await productsApi.getById(id);
        return mapApiProductToProduct(apiProduct);
      } catch (error) {
        console.warn("API indisponible, fallback sur les mocks:", error);
        return null;
      }
    },
    [id]
  );
}

export function useFeaturedProducts() {
  return useFetch(
    async () => {
      try {
        const items = await productsApi.getFeatured();
        return items.map(mapApiProductToProduct);
      } catch (error) {
        console.warn("API indisponible, fallback sur les mocks:", error);
        return [];
      }
    },
    []
  );
}

export function useCategories() {
  return useFetch(
    async () => {
      try {
        return await categoriesApi.list();
      } catch (error) {
        console.warn("API indisponible, fallback sur les mocks:", error);
        return [];
      }
    },
    []
  );
}
