"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Countdown } from "./ui/countdown";
import { Zap, ArrowRight, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface FlashSaleProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  sold: number;
}

interface FlashSaleProps {
  endsAt: string | Date;
  title?: string;
  subtitle?: string;
}

export function FlashSale({
  endsAt,
  title = "Ventes Flash",
  subtitle = "Offres limitées dans le temps",
}: FlashSaleProps) {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFlashSale() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/promotions/flash-sale`, {
          next: { revalidate: 30 },
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          setProducts(getFallbackProducts());
        }
      } catch (err) {
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    }

    loadFlashSale();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-red-500 fill-red-500" />
              <h2 className="text-3xl font-bold text-dark">{title}</h2>
            </div>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Se termine dans :</span>
            <Countdown endsAt={endsAt} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <FlashSaleCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FlashSaleCard({ product }: { product: FlashSaleProduct }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const stockPercent = (product.stock / (product.stock + product.sold)) * 100;
  const isAlmostOut = stockPercent < 30;

  return (
    <div className="group bg-white rounded-xl border-2 border-red-200 overflow-hidden hover:shadow-2xl hover:border-red-400 transition-all duration-300">
      {/* Badge FLASH */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center text-xs font-bold py-1.5 flex items-center justify-center gap-1">
          <Zap className="h-3 w-3 fill-white" />
          FLASH -{discount}%
        </div>

        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        {/* Prix */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-red-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-400 line-through">
            {formatPrice(product.oldPrice)}
          </span>
        </div>

        {/* Barre de stock */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={`font-semibold ${isAlmostOut ? "text-red-500" : "text-gray-600"}`}>
              {isAlmostOut ? "Bientôt épuisé !" : "En stock"}
            </span>
            <span className="text-gray-500">
              {product.stock} restants
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all rounded-full ${
                isAlmostOut ? "bg-red-500" : "bg-gradient-to-r from-red-500 to-orange-500"
              }`}
              style={{ width: `${stockPercent}%` }}
            />
          </div>
        </div>

        <Link
          href={`/produit/${product.id}`}
          className="block w-full mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center text-sm font-bold py-2.5 rounded-md hover:from-red-600 hover:to-orange-600 transition"
        >
          Acheter maintenant
        </Link>
      </div>
    </div>
  );
}

function getFallbackProducts(): FlashSaleProduct[] {
  return [
    { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", price: 850000, oldPrice: 950000, image: "/images/products/iphone.jpg", rating: 4.8, reviews: 124, stock: 8, sold: 42 },
    { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 750000, oldPrice: 820000, image: "/images/products/samsung.jpg", rating: 4.7, reviews: 89, stock: 3, sold: 27 },
    { id: 3, name: "AirPods Pro 2 USB-C", brand: "Apple", price: 195000, oldPrice: 220000, image: "/images/products/airpods.jpg", rating: 4.9, reviews: 256, stock: 15, sold: 85 },
    { id: 4, name: "PlayStation 5 Slim", brand: "Sony", price: 480000, oldPrice: 520000, image: "/images/products/ps5.svg", rating: 4.9, reviews: 312, stock: 5, sold: 18 },
  ];
}
