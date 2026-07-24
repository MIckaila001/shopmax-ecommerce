"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  Check,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ordersApi } from "@/lib/api-client";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered";

interface OrderStatusStep {
  key: OrderStatus;
  label: string;
  icon: React.ElementType;
}

const STATUS_STEPS: OrderStatusStep[] = [
  { key: "pending", label: "Commandée", icon: Clock },
  { key: "confirmed", label: "Confirmée", icon: Check },
  { key: "processing", label: "En préparation", icon: Package },
  { key: "shipped", label: "Expédiée", icon: Truck },
  { key: "delivered", label: "En cours de livraison", icon: MapPin },
];

interface TrackingInfo {
  status: OrderStatus;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  lastUpdate: string;
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<TrackingSkeleton />}>
      <TrackingContent />
    </Suspense>
  );
}

function TrackingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
    </div>
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const refFromUrl = searchParams?.get("ref");

  const [orderNumber, setOrderNumber] = useState(refFromUrl || "");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Si on a un ref dans l'URL, on simule un chargement auto
  useEffect(() => {
    if (refFromUrl) {
      handleTrack(refFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refFromUrl]);

  const handleTrack = async (orderRef?: string) => {
    const ref = orderRef || orderNumber;
    if (!ref.trim()) {
      setError("Veuillez entrer un numéro de commande.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTracking(null);

    // Tente d'appeler l'API réelle
    try {
      try {
        const data = await ordersApi.getTracking(ref);
        const statusMap: Record<string, OrderStatus> = {
          Pending: "pending",
          Confirmed: "confirmed",
          Processing: "processing",
          Shipped: "shipped",
          Delivered: "delivered",
        };
        setTracking({
          status: statusMap[data.status] || "confirmed",
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          estimatedDelivery: data.estimatedDelivery,
          lastUpdate: data.lastUpdate,
        });
        setIsLoading(false);
        return;
      } catch (apiError) {
        console.warn("API indisponible, fallback mock:", apiError);
      }

      // Fallback mock
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const hash = ref.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];
      const status = statuses[hash % statuses.length];

      setTracking({
        status,
        trackingNumber: `AME-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        carrier: "Amana Express",
        estimatedDelivery: "Prévue le 26 mai 2024",
        lastUpdate: new Date().toLocaleString("fr-FR"),
      });
    } catch (error) {
      setError("Erreur lors du suivi de la commande.");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStepIndex = (status: OrderStatus) => {
    return STATUS_STEPS.findIndex((s) => s.key === status);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Suivi de commande</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Suivi de commande</h1>
      <p className="text-gray-500 mb-6">
        Entrez votre numéro de commande et votre email pour suivre votre colis
      </p>

      {/* ============================== */}
      {/* FORMULAIRE DE RECHERCHE        */}
      {/* ============================== */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack();
            }}
            className="grid sm:grid-cols-3 gap-3"
          >
            <div>
              <label className="text-sm font-medium block mb-1.5">
                N° de commande
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="SMX-20240524-XXXXXX"
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Suivre
              </Button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ============================== */}
      {/* RÉSULTAT DU SUIVI              */}
      {/* ============================== */}
      {tracking && (
        <>
          {/* Statut actuel */}
          <Card className="mb-6 border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Statut actuel</p>
                  <h2 className="text-xl font-bold mt-1">
                    {STATUS_STEPS.find((s) => s.key === tracking.status)?.label}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Dernière mise à jour : {tracking.lastUpdate}
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <Badge
                    variant={tracking.status === "delivered" ? "success" : "default"}
                    className="text-sm px-3 py-1"
                  >
                    {tracking.status === "delivered" ? "Livrée" : "En cours"}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-2">
                    {tracking.estimatedDelivery}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-6">Progression de votre commande</h3>

              <div className="relative">
                {/* Ligne verticale (mobile) / horizontale (desktop) */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 md:left-0 md:top-5 md:right-0 md:bottom-auto md:h-0.5 md:w-full" />

                <ol className="space-y-8 md:space-y-0 md:grid md:grid-cols-5 md:gap-2">
                  {STATUS_STEPS.map((step, index) => {
                    const currentIndex = getCurrentStepIndex(tracking.status);
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = step.icon;

                    return (
                      <li
                        key={step.key}
                        className="relative flex md:flex-col items-start md:items-center gap-3 md:gap-2 md:text-center"
                      >
                        {/* Icône */}
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            isCompleted
                              ? "bg-success border-success text-white"
                              : isCurrent
                              ? "bg-primary border-primary text-white animate-pulse"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {isCompleted && (
                            <Check
                              className="absolute h-3 w-3 bg-success text-white rounded-full -bottom-1 -right-1 p-0.5"
                            />
                          )}
                        </div>

                        {/* Label */}
                        <div className="md:mt-2">
                          <p
                            className={`text-xs sm:text-sm font-semibold ${
                              isCompleted || isCurrent ? "text-dark" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {isCompleted
                              ? "✓ Terminé"
                              : isCurrent
                              ? "En cours"
                              : "En attente"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Détails + infos livraison */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" /> Détails de la commande
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">N° de commande :</span>{" "}
                    <span className="font-mono font-medium">{orderNumber}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Date :</span>{" "}
                    <span className="font-medium">24 mai 2024</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Total :</span>{" "}
                    <span className="font-bold">16 497 FCFA</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Paiement :</span>{" "}
                    <span className="font-medium">Mobile Money</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Informations de livraison
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Livreur :</span>{" "}
                    <span className="font-medium">{tracking.carrier}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Téléphone :</span>{" "}
                    <span className="font-medium">+212 6 86 76 54 32</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Transporteur :</span>{" "}
                    <span className="font-medium">Amana Express</span>
                  </p>
                  <p>
                    <span className="text-gray-500">N° de suivi :</span>{" "}
                    <span className="font-mono font-medium text-xs">
                      {tracking.trackingNumber}
                    </span>
                  </p>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <Headphones className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/compte/commandes">
                Voir toutes mes commandes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </>
      )}

      {/* État initial - aide */}
      {!tracking && !isLoading && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <Truck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="font-semibold mb-1">Comment ça marche ?</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Entrez votre numéro de commande (reçu par email) et l'email utilisé lors de la commande pour suivre votre colis en temps réel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
