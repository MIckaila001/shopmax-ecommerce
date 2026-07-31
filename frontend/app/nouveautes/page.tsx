"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, Star, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { Reveal } from "@/components/ui/reveal";
import { products as mockProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

// Date de fin pour les nouveautés (1 semaine)
const NEW_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

export default function NouveautesPage() {
  // Les nouveautés : tous les produits avec badge NEW
  let newProducts = mockProducts.filter((p) => p.badge === "NEW");
  // Si pas assez, on complète avec les premiers produits
  if (newProducts.length < 8) {
    newProducts = [...newProducts, ...mockProducts.filter((p) => p.badge !== "NEW").slice(0, 8 - newProducts.length)];
  }
  // On prend les 12 premiers
  newProducts = newProducts.slice(0, 12);

  // Le produit "vedette" (le premier)
  const featured = newProducts[0];
  const others = newProducts.slice(1);

  return (
    <div>
      {/* HERO avec image */}
      <section className="relative h-[450px] overflow-hidden">
        <Image
          src="/images/products/iphone.jpg"
          alt="Nouveautés ShopMax"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <Reveal>
              <Badge className="bg-green-500 text-white text-sm px-3 py-1 mb-4">
                <Sparkles className="h-3 w-3 mr-1" /> NOUVEAUTÉS
              </Badge>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                Les dernières <br />
                <span className="text-primary">innovations</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-lg text-gray-200 mb-6">
                Découvrez nos produits les plus récents, sélectionnés avec soin pour vous.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">Disponible pendant :</span>
                <Countdown endsAt={NEW_END_DATE} compact />
              </div>
            </Reveal>
          </div>
        </div>

        {/* Badge flottant */}
        <div className="absolute top-10 right-10 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold hidden md:block animate-float">
          ✨ FRAÎCHEMENT ARRIVÉ
        </div>
      </section>

      {/* Produit vedette */}
      {featured && (
        <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <Reveal>
              <div className="flex items-center gap-2 mb-8">
                <Zap className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Produit phare</h2>
              </div>
            </Reveal>

            <Reveal>
              <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 shadow-xl">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-500 text-white text-base px-3 py-1">
                    NOUVEAU
                  </Badge>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">{featured.brand}</p>
                  <h3 className="text-3xl font-extrabold mt-1">{featured.name}</h3>
                  <div className="flex items-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(featured.rating) ? "fill-primary text-primary" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({featured.reviewsCount} avis)</span>
                  </div>
                  <p className="text-gray-600 mt-4">
                    Decouvrez ce nouveau produit qui revolutionne le marche. Qualite premium, design moderne, performances exceptionnelles.
                  </p>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-dark">
                      {formatPrice(featured.price)} FCFA
                    </span>
                    {featured.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(featured.oldPrice)} FCFA
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Link
                      href={`/produit/${featured.id}`}
                      className="flex-1 bg-primary text-dark text-center font-bold py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                      Decouvrir
                    </Link>
                    <Button variant="outline" size="icon">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Grille des autres nouveautés */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Plus de nouveautés</h2>
            </div>
          </Reveal>
          <Reveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {others.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center">
        <div className="container mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Ne manquez aucune nouveauté
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
              Inscrivez-vous à notre newsletter pour être le premier informé
            </p>
          </Reveal>
          <Reveal delay={200}>
            <form className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 rounded-lg text-dark"
              />
              <button
                type="submit"
                className="bg-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-dark/90 transition"
              >
                S'inscrire
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: typeof mockProducts[number] }) {
  return (
    <Card className="group overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/produit/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
            {product.badge}
          </Badge>
        )}
      </Link>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          <Link href={`/produit/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-bold text-dark">
            {formatPrice(product.price)} FCFA
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)} FCFA
            </span>
          )}
        </div>
        <Button className="w-full mt-3" size="sm" asChild>
          <Link href={`/produit/${product.id}`}>Découvrir</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
