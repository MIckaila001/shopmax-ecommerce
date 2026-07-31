"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { products as mockProducts } from "@/lib/data";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

// Date de fin pour la promo (dans 2h45min - expire bientot)
const PROMO_END_DATE = new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString();

export default function PromotionsPage() {
  // Tous les produits en promo
  const promoProducts = mockProducts.filter((p) => p.oldPrice);

  return (
    <div>
      {/* Hero promo */}
      <section className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="destructive" className="mb-4 text-sm px-3 py-1">
            <Flame className="h-3 w-3 mr-1" /> OFFRES LIMITÉES
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            Méga Promotions 🔥
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Profitez de réductions exceptionnelles sur une sélection de produits.
            Offres valables jusqu&apos;à épuisement des stocks.
          </p>

          {/* Countdown - TEMPS REEL */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Fin des offres dans :</span>
            <Countdown endsAt={PROMO_END_DATE} />
          </div>
        </div>
      </section>

      {/* Grille de produits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">{promoProducts.length} produits en promotion</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoProducts.map((product) => {
              const discount = product.oldPrice
                ? getDiscountPercent(product.oldPrice, product.price)
                : 0;
              return (
                <Card key={product.id} className="group overflow-hidden border-gray-200 hover:shadow-lg transition-all">
                  <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                    <Image unoptimized
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge variant="destructive" className="absolute top-2 right-2 text-base px-3 py-1">
                      -{discount}%
                    </Badge>
                  </Link>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
                    <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
                      <Link href={`/produit/${product.id}`}>{product.name}</Link>
                    </h3>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-dark">{formatPrice(product.price)}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>
                    <Button className="w-full mt-3" size="sm">
                      Voir l&apos;offre
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
