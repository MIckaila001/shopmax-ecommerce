"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { products } from "@/lib/data";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  // Frais de livraison
  const shippingCost = subtotal > 50000 ? 0 : 1500;
  // Réduction
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - discount;

  // Produits recommandés (exclure ceux déjà au panier)
  const recommended = products
    .filter((p) => !items.find((item) => item.id === p.id))
    .slice(0, 4);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "SHOPMAX10") {
      setPromoApplied(true);
    }
  };

  // ==============================
  // PANIER VIDE
  // ==============================
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Votre panier est vide</h1>
          <p className="text-gray-500 mb-6">
            Découvrez nos produits et commencez vos achats !
          </p>
          <Button asChild size="lg">
            <Link href="/boutique">
              Explorer la boutique
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Mon panier</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Mon panier</h1>
      <p className="text-gray-500 mb-8">
        {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
      </p>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* ============================== */}
        {/* LISTE DES ARTICLES             */}
        {/* ============================== */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Image */}
                  <Link
                    href={`/produit/${item.id}`}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image unoptimized
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produit/${item.id}`}
                      className="font-semibold line-clamp-2 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.variantInfo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variantInfo}
                      </p>
                    )}

                    {/* Quantité + prix (mobile) */}
                    <div className="mt-3 flex items-center justify-between sm:hidden">
                      <p className="font-bold text-dark">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price)} l'unité
                      </p>
                    </div>

                    {/* Contrôles quantité + suppression */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1.5 hover:bg-gray-100"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 py-1.5 font-medium min-w-[2.5rem] text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1.5 hover:bg-gray-100"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-destructive transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Prix (desktop) */}
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="font-bold text-lg text-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPrice(item.price)} l'unité
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" asChild>
              <Link href="/boutique">
                ← Continuer mes achats
              </Link>
            </Button>
            <Button variant="ghost" onClick={clearCart} className="text-gray-500">
              <Trash2 className="h-4 w-4 mr-2" />
              Vider le panier
            </Button>
          </div>

          {/* ============================== */}
          {/* VOUS POURRIEZ AUSSI AIMER      */}
          {/* ============================== */}
          {recommended.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4">Vous pourriez aussi aimer</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {recommended.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produit/${product.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image unoptimized
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-dark mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================== */}
        {/* RÉCAP & PAIEMENT               */}
        {/* ============================== */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Récapitulatif de la commande</h2>

              {/* Code promo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Code promo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez votre code"
                    disabled={promoApplied}
                    className="flex-1 h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    onClick={applyPromo}
                    disabled={promoApplied || !promoCode}
                  >
                    {promoApplied ? "✓" : "Appliquer"}
                  </Button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-success font-medium">
                    ✓ Code promo appliqué (-10%)
                  </p>
                )}
                {!promoApplied && (
                  <p className="text-xs text-gray-500">
                    Essayez <code className="bg-gray-100 px-1 rounded">SHOPMAX10</code> pour 10% de réduction
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className={`font-medium ${shippingCost === 0 ? "text-success" : ""}`}>
                    {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Réduction</span>
                    <span className="font-medium text-success">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-dark">{formatPrice(total)}</span>
                </div>
              </div>

              <Button size="lg" className="w-full" asChild>
                <Link href="/commande">
                  Passer la commande
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              {/* Moyens de paiement */}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2 text-center">
                  Moyens de paiement acceptés
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {["MTN", "Orange", "VISA", "Mastercard"].map((method) => (
                    <span
                      key={method}
                      className="text-xs bg-gray-100 px-2 py-1 rounded font-medium"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                <CreditCard className="h-3 w-3" />
                Paiement 100% sécurisé
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
