"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { products as mockProducts, categories as mockCategories } from "@/lib/data";
import { useFeaturedProducts, useCategories } from "@/lib/hooks/use-products";
import { Loading } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";
import { HERO_PLACEHOLDER } from "@/lib/image-fallback";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

export default function HomePage() {
  const {
    data: featuredProducts,
    isLoading: loadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useFeaturedProducts();

  const {
    data: apiCategories,
    isLoading: loadingCategories,
  } = useCategories();

  // Fallback sur les mocks si l'API ne répond pas
  const products = featuredProducts && featuredProducts.length > 0
    ? featuredProducts
    : mockProducts;

  const categories = apiCategories && apiCategories.length > 0
    ? apiCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.imageUrl || mockCategories.find((m) => m.slug === c.slug)?.image || mockCategories[0].image,
        productCount: c.productCount || 0,
      }))
    : mockCategories;

  const todayDeals = products.filter((p) => p.oldPrice || p.badge?.startsWith("-"));

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Bienvenue sur ShopMax
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-balance">
                Découvrez le meilleur du{" "}
                <span className="text-primary">shopping en ligne</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Des produits de qualité, au meilleur prix. Livraison rapide et paiement
                sécurisé partout au Cameroun.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/boutique">
                    Explorer <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/promotions">Voir les offres</Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Truck, label: "Livraison rapide", sub: "Partout au Cameroun" },
                  { icon: Shield, label: "Paiement sécurisé", sub: "100% sécurisé" },
                  { icon: RefreshCw, label: "Retour 30 jours", sub: "Satisfait ou remboursé" },
                  { icon: Headphones, label: "Support 24/7", sub: "À votre écoute" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src="/images/hero/main.jpg"
                alt="Hero ShopMax"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATÉGORIES POPULAIRES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Catégories populaires</h2>
              <p className="text-gray-500 mt-1">Explorez nos univers</p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingCategories ? (
            <Loading text="Chargement des catégories..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {cat.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cat.productCount > 0 ? `${cat.productCount} produits` : "Découvrir"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* OFFRES DU JOUR */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">Offres du jour</h2>
                <Badge variant="destructive">HOT</Badge>
              </div>
              <p className="text-gray-500">
                Profitez de nos meilleurs prix avant la fin du compte à rebours
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Fin de l&apos;offre dans :</span>
              <div className="flex gap-1">
                {["08", "45", "32"].map((val, i) => (
                  <div key={i} className="bg-dark text-white px-3 py-2 rounded-md font-mono font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loadingProducts ? (
            <Loading text="Chargement des offres..." />
          ) : productsError && todayDeals.length === 0 ? (
            <ErrorState onRetry={refetchProducts} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {todayDeals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PRODUITS VEDETTES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tendances du moment</h2>
              <p className="text-gray-500 mt-1">Les produits les plus populaires</p>
            </div>
            <Link
              href="/boutique"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <Loading text="Chargement des produits..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// =====================================================
// Product Card Component
// =====================================================
function ProductCard({ product }: { product: typeof mockProducts[number] }) {
  const discount = product.oldPrice
    ? getDiscountPercent(product.oldPrice, product.price)
    : 0;

  return (
    <Card className="group overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <Badge
            variant={product.badge === "NEW" ? "success" : "destructive"}
            className="absolute top-2 left-2"
          >
            {product.badge}
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            -{discount}%
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewsCount})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-dark">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <Button className="w-full mt-4" size="sm" asChild>
          <Link href={`/produit/${product.id}`}>Ajouter</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
