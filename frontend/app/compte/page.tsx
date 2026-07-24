"use client";

import Link from "next/link";
import {
  Package,
  MapPin,
  Heart,
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatPrice } from "@/lib/utils";
import { ordersApi, type ApiOrder } from "@/lib/api-client";

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Charger les vraies commandes depuis l'API
  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        const data = await ordersApi.getUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.warn("Impossible de charger les commandes:", err);
        setOrdersError("Commandes indisponibles pour le moment");
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  // Stats calculees dynamiquement
  const stats = [
    { label: "Commandes", value: String(orders.length || 0), icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Favoris", value: "0", icon: Heart, color: "text-pink-600 bg-pink-50" },
    { label: "Adresses", value: "0", icon: MapPin, color: "text-green-600 bg-green-50" },
  ];

  // Commandes recentes (top 4)
  const recentOrders = orders.slice(0, 4).map((o) => ({
    id: o.orderNumber,
    date: new Date(o.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    total: o.total,
    status: o.status === "Delivered" ? "Livrée" : o.status === "Shipped" ? "Expédiée" : o.status === "Cancelled" ? "Annulée" : o.status,
    statusColor: (o.status === "Delivered" ? "success" : o.status === "Cancelled" ? "destructive" : "default") as "success" | "destructive" | "default",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Bonjour {user?.firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">Voici un aperçu de votre compte</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4 sm:p-6">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dernières commandes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" /> Mes dernières commandes
            </h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/compte/commandes">
                Voir tout
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {ordersLoading && (
            <p className="text-sm text-gray-500 text-center py-4">Chargement des commandes...</p>
          )}

          {ordersError && !ordersLoading && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">{ordersError}</p>
            </div>
          )}

          {!ordersLoading && !ordersError && recentOrders.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune commande pour le moment.
            </p>
          )}

          {!ordersLoading && !ordersError && recentOrders.length > 0 && (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/compte/commandes"
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold">{order.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant={order.statusColor}>{order.status}</Badge>
                      <p className="text-sm font-bold mt-1">{formatPrice(order.total)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">Suivre une commande</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Suivez votre colis en temps réel
                </p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href="/suivi">
                    Suivre maintenant
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">Compléter mon profil</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ajoutez vos infos pour une meilleure expérience
                </p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href="/compte/profil">
                    Modifier le profil
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
