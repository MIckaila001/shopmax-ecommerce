"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, type ApiUser, type LoginDto, type RegisterDto as ApiRegisterDto } from "@/lib/api-client";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "Customer" | "Admin" | "Vendor";
  avatarUrl?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginWithOAuth: (provider: "google" | "facebook") => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  hydrateFromStorage: () => void;
}

interface AuthResponse {
  token: string;
  user: ApiUser;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "shopmax_auth";

// Convertit un ApiUser en User (identiques pour l'instant)
const mapApiUser = (apiUser: ApiUser): User => ({
  id: apiUser.id,
  firstName: apiUser.firstName,
  lastName: apiUser.lastName,
  email: apiUser.email,
  phone: apiUser.phone,
  role: apiUser.role,
  avatarUrl: apiUser.avatarUrl,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { user: u, token: t } = JSON.parse(stored);
        setUser(u);
        setToken(t);
      }
    } catch (error) {
      console.error("Erreur de chargement auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sauvegarder à chaque changement
  useEffect(() => {
    if (isLoading) return;
    if (user && token) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user, token, isLoading]);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password } as LoginDto);
      const user = mapApiUser(response.user);
      setUser(user);
      setToken(response.token);
      return { success: true };
    } catch (error: any) {
      console.warn("Login API failed, using mock:", error.message);
      // Fallback mock si l'API n'est pas dispo (dev sans backend)
      if (!email || !password) {
        return { success: false, error: "Email et mot de passe requis." };
      }
      if (password.length < 6) {
        return { success: false, error: "Mot de passe incorrect." };
      }
      const mockUser: User = {
        id: 1,
        firstName: "Ismaila",
        lastName: "Bouba",
        email,
        role: "Customer",
      };
      const mockToken = `mock-jwt-${Math.random().toString(36).substring(2)}`;
      setUser(mockUser);
      setToken(mockToken);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      } as ApiRegisterDto);
      const user = mapApiUser(response.user);
      setUser(user);
      setToken(response.token);
      return { success: true };
    } catch (error: any) {
      console.warn("Register API failed, using mock:", error.message);
      // Fallback mock
      if (!data.firstName || !data.lastName || !data.email || !data.password) {
        return { success: false, error: "Tous les champs sont requis." };
      }
      if (data.password.length < 8) {
        return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères." };
      }
      if (data.email === "test@shopmax.cm") {
        return { success: false, error: "Cet email est déjà utilisé." };
      }
      const newUser: User = {
        id: Math.floor(Math.random() * 1000),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: "Customer",
      };
      const mockToken = `mock-jwt-${Math.random().toString(36).substring(2)}`;
      setUser(newUser);
      setToken(mockToken);
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const loginWithOAuth = async (provider: "google" | "facebook") => {
    // Redirige vers le backend qui gère OAuth
    window.location.href = authApi.getOAuthUrl(provider);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  };

  /**
   * Recharge l'auth depuis le localStorage
   * Utile apres un callback OAuth ou un redirect
   */
  const hydrateFromStorage = () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { user: u, token: t } = JSON.parse(stored);
        setUser(u);
        setToken(t);
      }
    } catch (error) {
      console.error("Erreur hydratation auth:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        loginWithOAuth,
        updateUser,
        hydrateFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}
