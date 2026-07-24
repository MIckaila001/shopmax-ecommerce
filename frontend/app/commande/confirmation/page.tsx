"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Check, Package, ArrowRight, Home, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface OrderData {
  orderNumber: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  specialRequest?: string;
  createdAt: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  MTN: "MTN Mobile Money",
  Orange: "Orange Money",
  Visa: "Carte Visa",
  Mastercard: "Mastercard",
  CashOnDelivery: "Paiement à la livraison",
};

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2" />
        <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
      </div>
    </div>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams?.get("ref");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("last_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, []);

  // Pas de commande trouvée
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Aucune commande trouvée</p>
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* EN-TÊTE SUCCÈS */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" />
          <div className="relative w-20 h-20 bg-success rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Merci pour votre commande !
        </h1>
        <p className="text-gray-600">
          Votre commande a été passée avec succès.
        </p>
      </div>

      {/* Numéro de commande */}
      <Card className="mb-6 border-2 border-success/20 bg-success/5">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600 mb-1">Numéro de commande</p>
          <p className="text-2xl md:text-3xl font-bold text-dark font-mono">
            {order.orderNumber}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Un email de confirmation a été envoyé à{" "}
            <span className="font-medium text-dark">
              {order.shippingAddress.email}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* DÉTAILS DE LA COMMANDE */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" /> Détails de la commande
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
            <div>
              <p className="text-gray-500">Livraison</p>
              <p className="font-medium">
                {order.shippingMethod === "delivery" ? "À domicile" : "Point relais"}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500">Adresse</p>
              <p className="font-medium">
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Paiement</p>
              <p className="font-medium">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-bold text-lg text-dark">{formatPrice(order.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ARTICLES COMMANDÉS */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">
            Articles commandés ({order.items.length})
          </h2>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-3 border-b last:border-0"
              >
                <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image unoptimized
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-1">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                </div>
                <p className="font-semibold shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Livraison</span>
              <span className={order.shippingCost === 0 ? "text-success" : ""}>
                {order.shippingCost === 0 ? "Gratuite" : formatPrice(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total payé</span>
              <span className="text-dark">{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PROCHAINES ÉTAPES */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Prochaines étapes
          </h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">1.</span>
              <span>Confirmation de votre commande par email</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">2.</span>
              <span>Préparation de votre colis (1-2 jours)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">3.</span>
              <span>Expédition et numéro de suivi envoyé par SMS</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-600">4.</span>
              <span>Livraison à votre adresse</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" variant="dark" asChild>
          <Link href={`/suivi?ref=${order.orderNumber}`}>
            <Truck className="h-4 w-4 mr-2" />
            Suivre ma commande
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Un problème avec votre commande ?{" "}
          <Link href="/contact" className="text-primary font-medium hover:underline">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
}
