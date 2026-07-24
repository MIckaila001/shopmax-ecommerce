import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/lib/hooks/use-auth";
import { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth()", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("démarre non authentifié", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it("connecte un utilisateur avec email/password valides", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login("test@shopmax.cm", "password123");
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe("test@shopmax.cm");
    expect(result.current.token).toBeTruthy();
  });

  it("rejette un mot de passe trop court", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login("test@shopmax.cm", "123");
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.error).toContain("incorrect");
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("rejette des identifiants vides", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login("", "");
    });

    expect(loginResult.success).toBe(false);
  });

  it("inscrit un nouvel utilisateur", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let registerResult: any;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: "John",
        lastName: "Doe",
        email: "newuser@shopmax.cm",
        password: "password123",
      });
    });

    expect(registerResult.success).toBe(true);
    expect(result.current.user?.firstName).toBe("John");
    expect(result.current.user?.role).toBe("Customer");
  });

  it("refuse l'inscription avec un email déjà pris", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let registerResult: any;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: "Test",
        lastName: "User",
        email: "test@shopmax.cm",
        password: "password123",
      });
    });

    expect(registerResult.success).toBe(false);
    expect(registerResult.error).toContain("utilisé");
  });

  it("refuse un mot de passe trop court à l'inscription", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let registerResult: any;
    await act(async () => {
      registerResult = await result.current.register({
        firstName: "John",
        lastName: "Doe",
        email: "new@shopmax.cm",
        password: "123",
      });
    });

    expect(registerResult.success).toBe(false);
  });

  it("déconnecte l'utilisateur", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@shopmax.cm", "password123");
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("persiste la session dans localStorage", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@shopmax.cm", "password123");
    });

    const stored = localStorage.getItem("shopmax_auth");
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.user.email).toBe("test@shopmax.cm");
    expect(parsed.token).toBeTruthy();
  });

  it("met à jour les infos du user", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login("test@shopmax.cm", "password123");
    });

    act(() => {
      result.current.updateUser({ firstName: "Nouveau Nom" });
    });

    expect(result.current.user?.firstName).toBe("Nouveau Nom");
  });
});
