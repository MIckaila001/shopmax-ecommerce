"use client";

import { Plus, MapPin, Edit2, Trash2, Home, Briefcase, Star } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Address {
  id: number;
  label: string;
  icon: "home" | "work";
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  {
    id: 1,
    label: "Domicile",
    icon: "home",
    fullName: "Ismaila Bouba",
    phone: "+212 6 12 34 56 78",
    address: "103, Avenue Mohammed V",
    city: "Casablanca",
    postalCode: "20000",
    country: "Cameroun",
    isDefault: true,
  },
  {
    id: 2,
    label: "Bureau",
    icon: "work",
    fullName: "Ismaila Bouba",
    phone: "+212 6 12 34 56 78",
    address: "Rue des entrepreneurs, Zone industrielle",
    city: "Casablanca",
    postalCode: "20280",
    country: "Cameroun",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);

  const setDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const removeAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Mes adresses</h1>
          <p className="text-gray-500 mt-1">Gérez vos adresses de livraison</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une adresse
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore d&apos;adresse</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter ma première adresse
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const Icon = address.icon === "home" ? Home : Briefcase;
            return (
              <Card key={address.id} className={address.isDefault ? "border-2 border-primary" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-bold">{address.label}</p>
                      {address.isDefault && (
                        <Badge variant="default" className="text-xs">
                          Par défaut
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-sm space-y-1 text-gray-700">
                    <p className="font-medium text-dark">{address.fullName}</p>
                    <p>{address.phone}</p>
                    <p>
                      {address.address}
                      <br />
                      {address.postalCode} {address.city}, {address.country}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                      Modifier
                    </Button>
                    {!address.isDefault && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDefault(address.id)}
                        >
                          <Star className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeAddress(address.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
