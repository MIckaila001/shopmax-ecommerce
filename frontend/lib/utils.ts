import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine les classes Tailwind de manière intelligente
 * (utilisé par tous les composants Shadcn)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un prix en FCFA (XAF)
 */
export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num) + " FCFA";
}

/**
 * Calcule le pourcentage de réduction
 */
export function getDiscountPercent(oldPrice: number, newPrice: number): number {
  if (!oldPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

/**
 * Tronque un texte
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Calcule les frais de livraison
 */
export function calculateShipping(
  subtotal: number,
  method: "delivery" | "pickup"
): number {
  if (method === "pickup") return 500;
  return subtotal >= 50000 ? 0 : 1500;
}

/**
 * Valide un email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valide un numéro de téléphone camerounais
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+237)?6[0-9]{8}$/.test(cleaned);
}

/**
 * Génère un numéro de commande unique
 */
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SMX-${date}-${random}`;
}
