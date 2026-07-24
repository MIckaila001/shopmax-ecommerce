import { api } from "./api";
import type { Product, Category } from "./data";

// =====================================================
// Types API (alignés avec le backend)
// =====================================================

export interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  imageUrl: string;
  brand: string;
  color: string;
  categoryId: number;
  category?: ApiCategory;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: number;
  productCount?: number;
}

export interface ApiOrder {
  id: number;
  orderNumber: string;
  userId: number;
  items: ApiOrderItem[];
  subTotal: number;
  shippingCost: number;
  total: number;
  status: "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  trackingNumber?: string;
  shippingAddress: ApiAddress;
  specialRequest?: string;
  createdAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface ApiOrderItem {
  id: number;
  productId: number;
  product: ApiProduct;
  quantity: number;
  unitPrice: number;
  variantInfo?: string;
}

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "Customer" | "Admin" | "Vendor";
}

export interface ApiAddress {
  id: number;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// =====================================================
// Service: Products
// =====================================================

export interface ProductsQuery {
  categoryId?: number;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "popularity" | "price-asc" | "price-desc" | "newest";
}

export const productsApi = {
  /**
   * Liste tous les produits avec filtres
   */
  async list(query: ProductsQuery = {}): Promise<{ items: ApiProduct[]; total: number }> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const items = await api.get<ApiProduct[]>(`/products?${params.toString()}`);
    const total = parseInt(
      // Le backend renvoie X-Total-Count, mais on simplifie ici
      "0"
    );

    return { items, total: items.length };
  },

  /**
   * Récupère un produit par ID
   */
  async getById(id: number): Promise<ApiProduct> {
    return api.get<ApiProduct>(`/products/${id}`);
  },

  /**
   * Produits featured (page d'accueil)
   */
  async getFeatured(): Promise<ApiProduct[]> {
    return api.get<ApiProduct[]>("/products/featured");
  },
};

// =====================================================
// Service: Categories
// =====================================================

export const categoriesApi = {
  /**
   * Liste toutes les catégories
   */
  async list(): Promise<ApiCategory[]> {
    return api.get<ApiCategory[]>("/categories");
  },

  /**
   * Récupère une catégorie par slug
   */
  async getBySlug(slug: string): Promise<ApiCategory> {
    return api.get<ApiCategory>(`/categories/slug/${slug}`);
  },
};

// =====================================================
// Service: Orders
// =====================================================

export interface CreateOrderDto {
  userId?: number;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{ productId: number; quantity: number; variantInfo?: string }>;
  paymentMethod: "MobileMoneyMTN" | "OrangeMoney" | "Visa" | "Mastercard" | "CashOnDelivery";
  shippingMethod: "delivery" | "pickup";
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  specialRequest?: string;
}

export interface CreateOrderResponse {
  orderNumber: string;
  total: number;
  paymentUrl?: string;
  transactionId?: string;
}

export const ordersApi = {
  /**
   * Crée une commande et initie le paiement
   */
  async create(data: CreateOrderDto, token?: string): Promise<CreateOrderResponse> {
    return api.post<CreateOrderResponse>("/orders", data, { token });
  },

  /**
   * Liste les commandes d'un utilisateur
   */
  async getUserOrders(userId: number, token?: string): Promise<ApiOrder[]> {
    return api.get<ApiOrder[]>(`/orders/user/${userId}`, { token });
  },

  /**
   * Détails d'une commande
   */
  async getByNumber(orderNumber: string, token?: string): Promise<ApiOrder> {
    return api.get<ApiOrder>(`/orders/${orderNumber}`, { token });
  },

  /**
   * Suivi en temps réel d'une commande
   */
  async getTracking(orderNumber: string): Promise<{
    status: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    lastUpdate: string;
  }> {
    return api.get(`/orders/${orderNumber}/tracking`);
  },
};

// =====================================================
// Service: Auth
// =====================================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

export const authApi = {
  /**
   * Connexion
   */
  async login(data: LoginDto): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/login", data);
  },

  /**
   * Inscription
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    return api.post<AuthResponse>("/auth/register", data);
  },

  /**
   * Récupère l'utilisateur courant
   */
  async me(token: string): Promise<ApiUser> {
    return api.get<ApiUser>("/auth/me", { token });
  },

  /**
   * OAuth Google/Facebook (redirection)
   */
  getOAuthUrl(provider: "google" | "facebook"): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${baseUrl}/api/auth/${provider}`;
  },
};

// =====================================================
// Mapper: Convertit un produit API en produit front
// =====================================================

export function mapApiProductToProduct(apiProduct: ApiProduct): Product & {
  category: string;
} {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    oldPrice: apiProduct.oldPrice,
    image: apiProduct.imageUrl,
    brand: apiProduct.brand,
    category: apiProduct.category?.name || "Autre",
    rating: apiProduct.rating,
    reviewsCount: apiProduct.reviewsCount,
    badge: apiProduct.oldPrice
      ? `-${Math.round(((apiProduct.oldPrice - apiProduct.price) / apiProduct.oldPrice) * 100)}%`
      : apiProduct.isFeatured
      ? "NEW"
      : undefined,
    inStock: apiProduct.stock > 0,
  };
}
