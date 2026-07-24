// =====================================================
// Mock data pour le developpement (avant l'API)
// Utilise les images locales (telechargees via download-images.bat)
// Si une image manque, fallback sur un SVG genere
// =====================================================

import { PRODUCT_PLACEHOLDERS, CATEGORY_PLACEHOLDERS, HERO_PLACEHOLDER } from "./image-fallback";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  category: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  inStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

/**
 * Helper : retourne l'image locale si elle existe, sinon le placeholder SVG
 * Note: au build time on ne peut pas tester l'existence, donc on assume
 * que si le user a lance download-images.bat, les images sont la.
 * Sinon, il peut editer manuellement.
 */
function img(localPath: string, fallback: string): string {
  return localPath; // On assume que les images sont la
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Électronique",
    slug: "electronique",
    image: img("/images/categories/electronique.jpg", CATEGORY_PLACEHOLDERS.electronique),
    productCount: 245,
  },
  {
    id: 2,
    name: "Mode Homme",
    slug: "mode-homme",
    image: img("/images/categories/mode-homme.jpg", CATEGORY_PLACEHOLDERS["mode-homme"]),
    productCount: 189,
  },
  {
    id: 3,
    name: "Mode Femme",
    slug: "mode-femme",
    image: img("/images/categories/mode-femme.jpg", CATEGORY_PLACEHOLDERS["mode-femme"]),
    productCount: 312,
  },
  {
    id: 4,
    name: "Maison & Cuisine",
    slug: "maison-cuisine",
    image: img("/images/categories/maison-cuisine.jpg", CATEGORY_PLACEHOLDERS["maison-cuisine"]),
    productCount: 156,
  },
  {
    id: 5,
    name: "Beauté & Santé",
    slug: "beaute-sante",
    image: img("/images/categories/beaute-sante.jpg", CATEGORY_PLACEHOLDERS["beaute-sante"]),
    productCount: 98,
  },
  {
    id: 6,
    name: "Sport & Loisirs",
    slug: "sport-loisirs",
    image: img("/images/categories/sport-loisirs.jpg", CATEGORY_PLACEHOLDERS["sport-loisirs"]),
    productCount: 124,
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro 128 Go - Titane Noir",
    description:
      "L'iPhone 15 Pro. Forgé en titane, doté d'un puissant appareil photo, d'une puce A17 Pro, d'un système photo Pro révolutionnaire et d'un port USB-C.",
    price: 1499000,
    oldPrice: 1799000,
    image: img("/images/products/iphone-15-pro.jpg", PRODUCT_PLACEHOLDERS[1]),
    brand: "Apple",
    category: "Électronique",
    rating: 4.8,
    reviewsCount: 128,
    badge: "-30%",
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra 256 Go",
    description:
      "Le nouveau Samsung Galaxy S24 Ultra avec IA intégrée, écran Dynamic AMOLED 2X et S Pen.",
    price: 1399000,
    image: img("/images/products/samsung-s24-ultra.jpg", PRODUCT_PLACEHOLDERS[2]),
    brand: "Samsung",
    category: "Électronique",
    rating: 4.7,
    reviewsCount: 95,
    badge: "NEW",
    inStock: true,
  },
  {
    id: 3,
    name: "Xiaomi 14 Pro 256 Go",
    description: "Smartphone haut de gamme avec caméra Leica et Snapdragon 8 Gen 3.",
    price: 749000,
    oldPrice: 899000,
    image: img("/images/products/xiaomi-14-pro.jpg", PRODUCT_PLACEHOLDERS[3]),
    brand: "Xiaomi",
    category: "Électronique",
    rating: 4.5,
    reviewsCount: 67,
    inStock: true,
  },
  {
    id: 4,
    name: "Casque Sony WH-1000XM5 Noir",
    description: "Casque sans fil premium avec réduction de bruit active, autonomie 30h.",
    price: 349000,
    oldPrice: 449000,
    image: img("/images/products/sony-wh1000xm5.jpg", PRODUCT_PLACEHOLDERS[4]),
    brand: "Sony",
    category: "Électronique",
    rating: 4.9,
    reviewsCount: 234,
    badge: "-22%",
    inStock: true,
  },
  {
    id: 5,
    name: "Apple AirPods Pro 2",
    description: "Écouteurs sans fil avec réduction de bruit active et audio spatial.",
    price: 299000,
    image: img("/images/products/airpods-pro-2.jpg", PRODUCT_PLACEHOLDERS[5]),
    brand: "Apple",
    category: "Électronique",
    rating: 4.8,
    reviewsCount: 456,
    inStock: true,
  },
  {
    id: 6,
    name: "Sac à dos urbain noir - 25L",
    description: "Sac à dos résistant à l'eau avec compartiment laptop 15.6 pouces.",
    price: 49900,
    oldPrice: 65000,
    image: img("/images/products/sac-a-dos.jpg", PRODUCT_PLACEHOLDERS[6]),
    brand: "Generic",
    category: "Mode Homme",
    rating: 4.4,
    reviewsCount: 89,
    badge: "-23%",
    inStock: true,
  },
  {
    id: 7,
    name: "Samsung Galaxy Watch 6 Classic",
    description: "Montre connectée premium avec suivi santé avancé et GPS.",
    price: 449000,
    oldPrice: 499000,
    image: img("/images/products/galaxy-watch-6.jpg", PRODUCT_PLACEHOLDERS[7]),
    brand: "Samsung",
    category: "Électronique",
    rating: 4.6,
    reviewsCount: 178,
    inStock: true,
  },
  {
    id: 8,
    name: "Nike Air Max Plus Homme",
    description: "Chaussures de sport iconiques avec amorti Tuned Air.",
    price: 179000,
    image: img("/images/products/nike-air-max-plus.jpg", PRODUCT_PLACEHOLDERS[8]),
    brand: "Nike",
    category: "Sport & Loisirs",
    rating: 4.7,
    reviewsCount: 312,
    badge: "HOT",
    inStock: true,
  },
  {
    id: 9,
    name: "Veste en cuir vintage",
    description: "Veste en cuir véritable, style motard, coupe ajustée.",
    price: 199000,
    image: img("/images/products/veste-cuir.jpg", PRODUCT_PLACEHOLDERS[9]),
    brand: "LeatherCraft",
    category: "Mode Homme",
    rating: 4.7,
    reviewsCount: 45,
    inStock: true,
  },
  {
    id: 10,
    name: "Adidas Ultraboost 23",
    description: "Chaussures de running haut de gamme avec retour d'énergie exceptionnel.",
    price: 195000,
    oldPrice: 220000,
    image: img("/images/products/adidas-ultraboost.jpg", PRODUCT_PLACEHOLDERS[10]),
    brand: "Adidas",
    category: "Sport & Loisirs",
    rating: 4.8,
    reviewsCount: 189,
    inStock: true,
  },
];
