"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, Heart, Share2, Truck, Shield, RefreshCw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products as mockProducts } from "@/lib/data";
import { useProduct } from "@/lib/hooks/use-products";
import { Loading } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { AddToCart } from "@/components/product/add-to-cart";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const { data: apiProduct, isLoading, error, refetch } = useProduct(id);

  // Fallback sur les mocks si l'API ne répond pas
  const product =
    apiProduct ||
    mockProducts.find((p) => p.id === id) ||
    null;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Loading size="lg" text="Chargement du produit..." />
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <ErrorState onRetry={refetch} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Produit introuvable</h1>
        <p className="text-gray-500 mb-6">Ce produit n&apos;existe pas ou a été retiré.</p>
        <Button asChild>
          <Link href="/boutique">Voir la boutique</Link>
        </Button>
      </div>
    );
  }

  const discount = product.oldPrice
    ? getDiscountPercent(product.oldPrice, product.price)
    : 0;

  const thumbnails = [product.image, product.image, product.image, product.image];

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/categories/${product.category.toLowerCase().replace(/ /g, "-")}`}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-dark font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image unoptimized
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.badge && (
              <Badge
                variant={product.badge === "NEW" ? "success" : "destructive"}
                className="absolute top-4 left-4"
              >
                {product.badge}
              </Badge>
            )}
            {discount > 0 && !product.badge && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                -{discount}%
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {thumbnails.map((img, i) => (
              <button
                key={i}
                className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 ${
                  i === 0 ? "border-primary" : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image unoptimized
                  src={img}
                  alt={`${product.name} - vue ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
            {product.brand}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviewsCount} avis)</span>
            <span className="text-sm text-gray-300">|</span>
            <span className={`text-sm font-medium ${product.inStock ? "text-success" : "text-destructive"}`}>
              {product.inStock ? "En stock" : "Rupture"}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-dark">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <Badge variant="destructive">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="mt-6 text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm font-semibold mb-3">Couleur : Titane Noir</p>
            <div className="flex gap-2">
              {[
                { name: "Titane Noir", color: "bg-gray-900", selected: true },
                { name: "Titane Blanc", color: "bg-gray-100 border", selected: false },
                { name: "Titane Bleu", color: "bg-blue-900", selected: false },
                { name: "Titane Naturel", color: "bg-amber-200", selected: false },
              ].map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  className={`w-10 h-10 rounded-full ${c.color} ${
                    c.selected ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold mb-3">Stockage</p>
            <div className="flex flex-wrap gap-2">
              {[
                { size: "128 Go", selected: true },
                { size: "256 Go", selected: false },
                { size: "512 Go", selected: false },
                { size: "1 To", selected: false },
              ].map((s) => (
                <button
                  key={s.size}
                  className={`px-4 py-2 text-sm font-medium rounded-md border ${
                    s.selected
                      ? "bg-primary border-primary text-dark"
                      : "bg-white border-gray-300 hover:border-primary"
                  }`}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          <AddToCart product={product} />

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Favoris
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">Livraison rapide</p>
                <p className="text-gray-500 text-xs">
                  Gratuite à partir de 50 000 FCFA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <RefreshCw className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">Retour sous 30 jours</p>
                <p className="text-gray-500 text-xs">Satisfait ou remboursé</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">Paiement 100% sécurisé</p>
                <p className="text-gray-500 text-xs">
                  Mobile Money, cartes bancaires
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
        <h2 className="text-xl font-bold mb-4">Description complète</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
          <h3 className="text-lg font-semibold mt-6 mb-3">Caractéristiques</h3>
          <ul className="space-y-2 text-gray-600">
            <li>✓ Écran Super Retina XDR 6,1 pouces avec ProMotion</li>
            <li>✓ Puce A17 Pro ultra-performante</li>
            <li>✓ Système photo Pro 48 Mpx avec téléobjectif 5x</li>
            <li>✓ USB-C avec USB 3 pour des transferts 20x plus rapides</li>
            <li>✓ Résistance à l&apos;eau et à la poussière IP68</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
