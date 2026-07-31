"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Flame, TrendingUp, Zap, Tag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { Reveal } from "@/components/ui/reveal";
import { products as mockProducts } from "@/lib/data";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

// Date de fin pour la promo
const PROMO_END_DATE = new Date(Date.now() + 2 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString();

// Categories de promos
const PROMO_CATEGORIES = [
  { name: "High-Tech", icon: "📱", count: 8, color: "from-blue-500 to-cyan-500" },
  { name: "Mode", icon: "👕", count: 5, color: "from-pink-500 to-rose-500" },
  { name: "Beauté", icon: "💄", count: 3, color: "from-purple-500 to-pink-500" },
  { name: "Maison", icon: "🏠", count: 2, color: "from-green-500 to-emerald-500" },
  { name: "Sport", icon: "⚽", count: 2, color: "from-orange-500 to-red-500" },
  { name: "Alimentation", icon: "🍎", count: 4, color: "from-yellow-500 to-orange-500" },
];

export default function PromotionsPage() {
  // Tous les produits en promo
  const promoProducts = mockProducts.filter((p) => p.oldPrice);
  // Les meilleures promos (discount > 20%)
  const topDeals = promoProducts.filter(p => {
    if (!p.oldPrice) return false;
    return ((p.oldPrice - p.price) / p.oldPrice) > 0.2;
  });

  return (
    <div>
      {/* HERO avec image plein écran */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Image de fond */}
        <Image
          src="/images/banners/promo1.svg"
          alt="Promotions ShopMax"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

        {/* Contenu */}
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Reveal>
              <Badge className="bg-red-500 text-white text-sm px-3 py-1 mb-4">
                <Flame className="h-3 w-3 mr-1" /> OFFRES LIMITÉES
              </Badge>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                Méga Promotions <br />
                <span className="text-primary">Jusqu'à -50%</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg text-gray-200 mb-6 max-w-xl">
                Profitez de réductions exceptionnelles sur une sélection de produits.
                Offres valables jusqu'à épuisement des stocks.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">Fin des offres dans :</span>
                <Countdown endsAt={PROMO_END_DATE} />
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex gap-3 flex-wrap">
                <Button size="lg" className="bg-primary text-dark hover:bg-primary/90 font-bold">
                  <Zap className="h-5 w-5 mr-2" />
                  Voir toutes les promos
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Tag className="h-5 w-5 mr-2" />
                  Catégories
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Decoration : badges flottants */}
        <div className="absolute top-10 right-10 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse-glow hidden md:block">
          🔥 VENTES FLASH
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-8 bg-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Reveal stagger>
              <div>
                <div className="text-3xl font-extrabold text-primary">{promoProducts.length}</div>
                <div className="text-xs text-gray-300">Produits en promo</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-primary">-50%</div>
                <div className="text-xs text-gray-300">Réduction max</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-primary">6</div>
                <div className="text-xs text-gray-300">Catégories</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-primary">2H45</div>
                <div className="text-xs text-gray-300">Temps restant</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catégories en promo */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Promotions par catégorie
            </h2>
          </Reveal>
          <Reveal stagger>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {PROMO_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/boutique?category=${cat.name.toLowerCase()}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br shadow-md hover:shadow-xl transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative h-full flex flex-col items-center justify-center text-white p-4">
                    <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <h3 className="font-bold text-sm">{cat.name}</h3>
                    <span className="text-xs text-white/80">{cat.count} promos</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Top deals */}
      {topDeals.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="flex items-center gap-2 mb-6">
                <Flame className="h-6 w-6 text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold">Top deals - Plus de 20% de réduction</h2>
              </div>
            </Reveal>
            <Reveal stagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topDeals.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Toutes les promos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">{promoProducts.length} produits en promotion</h2>
            </div>
          </Reveal>
          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: typeof mockProducts[number] }) {
  const discount = product.oldPrice ? getDiscountPercent(product.oldPrice, product.price) : 0;
  return (
    <Card className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <Badge variant="destructive" className="absolute top-2 right-2 text-base px-3 py-1 animate-pulse-glow">
          -{discount}%
        </Badge>
        <div className="absolute top-2 left-2 bg-primary text-dark text-xs font-bold px-2 py-1 rounded">
          🔥 HOT
        </div>
      </Link>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          <Link href={`/produit/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating) ? "text-primary" : "text-gray-300"}>★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewsCount})</span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-dark">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
        <Button className="w-full mt-3" size="sm">
          Voir l'offre
        </Button>
      </CardContent>
    </Card>
  );
}
