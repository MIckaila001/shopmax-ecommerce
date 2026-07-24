"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products as mockProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export default function NouveautesPage() {
  // Simule les nouveautés : tous les produits avec badge NEW
  const newProducts = mockProducts.filter((p) => p.badge === "NEW").slice(0, 8);
  // Si pas assez, on complète avec les premiers produits
  if (newProducts.length < 4) {
    newProducts.push(...mockProducts.filter((p) => p.badge !== "NEW").slice(0, 4));
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-transparent py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="success" className="mb-4 text-sm px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            NOUVEAUTÉS
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Dernières arrivées ✨
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez nos nouveaux produits, fraîchement ajoutés à notre catalogue.
          </p>
        </div>
      </section>

      {/* Grille */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">{newProducts.length} nouveaux produits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-gray-200 hover:shadow-lg transition-all">
                <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                  <Image unoptimized
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge variant="success" className="absolute top-2 left-2">
                    NEW
                  </Badge>
                </Link>
                <CardContent className="p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
                  <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                    <Link href={`/produit/${product.id}`}>{product.name}</Link>
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                    <span className="text-xs text-gray-500">{product.rating} ({product.reviewsCount})</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-lg font-bold text-dark">{formatPrice(product.price)}</span>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Découvrir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
