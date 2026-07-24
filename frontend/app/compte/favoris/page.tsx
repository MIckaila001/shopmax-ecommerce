"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { products } from "@/lib/data";

// Mock : 4 premiers produits en favoris
const initialFavorites = products.slice(0, 4).map((p, i) => ({
  ...p,
  addedAt: ["il y a 2 jours", "il y a 1 semaine", "il y a 2 semaines", "il y a 1 mois"][i],
}));

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const remove = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Mes favoris</h1>
        <p className="text-gray-500 mt-1">
          {favorites.length} article{favorites.length > 1 ? "s" : ""} dans vos favoris
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de favoris</p>
            <Button asChild>
              <Link href="/boutique">Explorer la boutique</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {favorites.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <Link href={`/produit/${product.id}`} className="block relative aspect-square">
                <Image unoptimized
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    remove(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                  aria-label="Retirer des favoris"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Link>

              <CardContent className="p-3 sm:p-4">
                <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                <Link
                  href={`/produit/${product.id}`}
                  className="font-semibold text-sm mt-1 line-clamp-2 hover:text-primary block min-h-[2.5rem]"
                >
                  {product.name}
                </Link>

                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-dark">{formatPrice(product.price)}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
