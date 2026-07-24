"use client";

import Link from "next/link";
import { Search, Package, ChevronRight, Download, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const orders = [
  {
    id: "SMX-2024-00125",
    date: "24 mai 2024",
    total: 16497,
    status: "En cours de livraison",
    statusVariant: "default" as const,
    items: 3,
  },
  {
    id: "SMX-2024-00120",
    date: "20 mai 2024",
    total: 2995,
    status: "Livrée",
    statusVariant: "success" as const,
    items: 1,
  },
  {
    id: "SMX-2024-00115",
    date: "16 mai 2024",
    total: 495,
    status: "Livrée",
    statusVariant: "success" as const,
    items: 1,
  },
  {
    id: "SMX-2024-00110",
    date: "10 mai 2024",
    total: 1299,
    status: "Annulée",
    statusVariant: "destructive" as const,
    items: 1,
  },
  {
    id: "SMX-2024-00100",
    date: "02 mai 2024",
    total: 5990,
    status: "Livrée",
    statusVariant: "success" as const,
    items: 2,
  },
];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "processing" | "delivered" | "cancelled">("all");

  const filteredOrders = orders.filter((order) => {
    if (search && !order.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "processing" && order.status !== "En cours de livraison") return false;
    if (filter === "delivered" && order.status !== "Livrée") return false;
    if (filter === "cancelled" && order.status !== "Annulée") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Mes commandes</h1>
        <p className="text-gray-500 mt-1">{orders.length} commandes au total</p>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une commande..."
                className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                { id: "all", label: "Toutes" },
                { id: "processing", label: "En cours" },
                { id: "delivered", label: "Livrées" },
                { id: "cancelled", label: "Annulées" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    filter === f.id
                      ? "bg-primary text-dark"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste */}
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-mono font-bold">{order.id}</p>
                      <Badge variant={order.statusVariant}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Passée le {order.date} • {order.items} article{order.items > 1 ? "s" : ""}
                    </p>
                    <p className="text-lg font-bold mt-2">{formatPrice(order.total)}</p>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    {order.status === "En cours de livraison" && (
                      <Button size="sm" asChild>
                        <Link href={`/suivi?ref=${order.id}`}>
                          Suivre
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    )}
                    {order.status === "Livrée" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Facture
                      </Button>
                    )}
                    {order.status === "Annulée" && (
                      <Button size="sm" variant="outline">
                        Recommander
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
