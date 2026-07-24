import { describe, it, expect, beforeEach, vi } from "vitest";
import { ApiError, api } from "@/lib/api";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("API Client", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("api.get()", () => {
    it("appelle fetch avec la bonne URL et la méthode GET", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 1, name: "Test" }),
      });

      await api.get("/products/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/products/1"),
        expect.objectContaining({ method: "GET" })
      );
    });

    it("ajoute le token JWT dans les headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await api.get("/auth/me", { token: "my-jwt-token" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer my-jwt-token",
          }),
        })
      );
    });

    it("renvoie les données JSON en cas de succès", async () => {
      const data = { id: 1, name: "Test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => data,
      });

      const result = await api.get("/products/1");
      expect(result).toEqual(data);
    });

    it("lance une ApiError en cas d'erreur HTTP", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Produit introuvable" }),
      });

      await expect(api.get("/products/999")).rejects.toThrow(ApiError);
    });

    it("utilise le message du backend s'il est présent", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ message: "Email déjà utilisé" }),
      });

      try {
        await api.get("/users");
      } catch (error: any) {
        expect(error.message).toBe("Email déjà utilisé");
        expect(error.status).toBe(400);
      }
    });
  });

  describe("api.post()", () => {
    it("envoie le body en JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 1 }),
      });

      const body = { email: "test@test.com", password: "123456" };
      await api.post("/auth/login", body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe("api.put()", () => {
    it("utilise la méthode PUT", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await api.put("/users/1", { name: "Updated" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  describe("api.delete()", () => {
    it("utilise la méthode DELETE", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

      await api.delete("/users/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: "DELETE" })
      );
    });
  });

  describe("Gestion d'erreurs réseau", () => {
    it("lance une ApiError en cas de problème réseau", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      try {
        await api.get("/products");
      } catch (error: any) {
        expect(error).toBeInstanceOf(ApiError);
        expect(error.status).toBe(0);
      }
    });
  });
});
