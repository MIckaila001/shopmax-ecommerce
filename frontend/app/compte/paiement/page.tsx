"use client";

import { Plus, CreditCard, Smartphone, Trash2, Star, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaymentMethod {
  id: number;
  type: "visa" | "mastercard" | "mtn" | "orange";
  label: string;
  details: string;
  isDefault: boolean;
}

const initialMethods: PaymentMethod[] = [
  {
    id: 1,
    type: "visa",
    label: "Carte Visa",
    details: "**** **** **** 4242 • Expire 12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "mtn",
    label: "MTN Mobile Money",
    details: "+237 6 12 34 56 78",
    isDefault: false,
  },
];

const methodConfig = {
  visa: { icon: CreditCard, color: "bg-blue-600", textColor: "text-white" },
  mastercard: { icon: CreditCard, color: "bg-red-500", textColor: "text-white" },
  mtn: { icon: Smartphone, color: "bg-yellow-400", textColor: "text-dark" },
  orange: { icon: Smartphone, color: "bg-orange-500", textColor: "text-white" },
};

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

  const setDefault = (id: number) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const remove = (id: number) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Moyens de paiement</h1>
          <p className="text-gray-500 mt-1">Gérez vos méthodes de paiement</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      {methods.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Aucun moyen de paiement enregistré</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un moyen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => {
            const config = methodConfig[method.type];
            const Icon = config.icon;
            return (
              <Card
                key={method.id}
                className={method.isDefault ? "border-2 border-primary" : ""}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-md ${config.color} ${config.textColor} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold">{method.label}</p>
                        {method.isDefault && (
                          <Badge variant="default" className="text-xs">
                            Par défaut
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-mono mt-1">
                        {method.details}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {method.isDefault && <Check className="h-5 w-5 text-primary" />}
                      {!method.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDefault(method.id)}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => remove(method.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Note info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 text-sm text-blue-900">
          <p>
            <strong>🔒 Paiement sécurisé :</strong> Vos informations bancaires sont
            chiffrées et stockées de manière sécurisée par{" "}
            <strong>NotchPay</strong>. Nous ne stockons jamais vos données sensibles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
