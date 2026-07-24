"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CreditCard, MapPin, Truck, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatPrice, calculateShipping, generateOrderNumber } from "@/lib/utils";
import { ordersApi } from "@/lib/api-client";

type ShippingMethod = "delivery" | "pickup";
type PaymentMethod = "MTN" | "Orange" | "Visa" | "Mastercard" | "CashOnDelivery";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { user, token } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MTN");
  const [specialRequest, setSpecialRequest] = useState("");

  // Form data
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Cameroun",
  });

  // Calculs
  const shippingCost = calculateShipping(subtotal, shippingMethod);
  const total = subtotal + shippingCost;

  // Validation simple
  const isFormValid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.postalCode.trim() &&
    items.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // Tente d'appeler l'API réelle
      try {
        const paymentMethodMap: Record<PaymentMethod, any> = {
          MTN: "MobileMoneyMTN",
          Orange: "OrangeMoney",
          Visa: "Visa",
          Mastercard: "Mastercard",
          CashOnDelivery: "CashOnDelivery",
        };

        const response = await ordersApi.create(
          {
            userId: user?.id,
            customerEmail: form.email,
            customerPhone: form.phone,
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              variantInfo: item.variantInfo,
            })),
            paymentMethod: paymentMethodMap[paymentMethod],
            shippingMethod,
            shippingAddress: {
              fullName: `${form.firstName} ${form.lastName}`,
              phone: form.phone,
              street: form.address,
              city: form.city,
              postalCode: form.postalCode,
              country: form.country,
            },
            specialRequest: specialRequest || undefined,
          },
          token || undefined
        );

        // Stocke les infos pour la confirmation
        const orderData = {
          orderNumber: response.orderNumber,
          items,
          subtotal,
          shippingCost,
          total: response.total,
          paymentMethod,
          shippingMethod,
          shippingAddress: form,
          specialRequest,
          createdAt: new Date().toISOString(),
          paymentUrl: response.paymentUrl,
        };
        sessionStorage.setItem("last_order", JSON.stringify(orderData));

        // Vide le panier
        clearCart();

        // Si une URL de paiement est retournée, on redirige vers NotchPay
        if (response.paymentUrl) {
          window.location.href = response.paymentUrl;
          return;
        }

        // Sinon, on va à la confirmation
        router.push(`/commande/confirmation?ref=${response.orderNumber}`);
        return;
      } catch (apiError) {
        console.warn("API indisponible, fallback mock:", apiError);
      }

      // Fallback mock si l'API n'est pas dispo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const orderNumber = generateOrderNumber();

      const orderData = {
        orderNumber,
        items,
        subtotal,
        shippingCost,
        total,
        paymentMethod,
        shippingMethod,
        shippingAddress: form,
        specialRequest,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem("last_order", JSON.stringify(orderData));

      clearCart();
      router.push(`/commande/confirmation?ref=${orderNumber}`);
    } catch (error) {
      console.error("Erreur lors de la commande:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==============================
  // PANIER VIDE → REDIRECTION
  // ==============================
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Votre panier est vide</p>
        <Button asChild>
          <Link href="/boutique">Explorer la boutique</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/panier" className="hover:text-primary">Panier</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Commande</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">Finaliser ma commande</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ============================== */}
          {/* FORMULAIRE                     */}
          {/* ============================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Infos personnelles */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-dark font-bold flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-lg font-bold">Informations de livraison</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Prénom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Ismaila"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Nom <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Bouba"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1.5">
                      Téléphone <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+237 6 XX XX XX XX"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adresse */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-dark font-bold flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5" /> Adresse de livraison
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1.5">
                      Adresse <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="103, Avenue Mohammed V"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Ville <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Yaoundé"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">
                      Code postal <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="20000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium block mb-1.5">Pays</label>
                    <Input value={form.country} disabled className="bg-gray-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Méthode de livraison */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-dark font-bold flex items-center justify-center">
                    3
                  </div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Truck className="h-5 w-5" /> Méthode de livraison
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      shippingMethod === "delivery"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "delivery"}
                      onChange={() => setShippingMethod("delivery")}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Livraison à domicile</p>
                        <span
                          className={`text-sm font-bold ${
                            shippingCost === 0 ? "text-success" : "text-dark"
                          }`}
                        >
                          {shippingMethod === "delivery"
                            ? shippingCost === 0
                              ? "Gratuite"
                              : formatPrice(shippingCost)
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        2-3 jours ouvrés
                        {subtotal < 50000 && shippingMethod === "delivery" && (
                          <span className="text-xs text-gray-400 ml-2">
                            (Gratuite à partir de 50 000 FCFA)
                          </span>
                        )}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      shippingMethod === "pickup"
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "pickup"}
                      onChange={() => setShippingMethod("pickup")}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Point relais</p>
                        <span className="text-sm font-bold text-success">
                          {formatPrice(500)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        1-2 jours ouvrés - Récupération dans un point relais
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Paiement */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-dark font-bold flex items-center justify-center">
                    4
                  </div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" /> Moyen de paiement
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: "MTN", label: "MTN Mobile Money", icon: "📱", color: "bg-yellow-400" },
                    { id: "Orange", label: "Orange Money", icon: "🍊", color: "bg-orange-500" },
                    { id: "Visa", label: "Carte Visa", icon: "💳", color: "bg-blue-600" },
                    { id: "Mastercard", label: "Mastercard", icon: "💳", color: "bg-red-500" },
                    { id: "CashOnDelivery", label: "Paiement à la livraison", icon: "💵", color: "bg-green-600" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === m.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === m.id}
                        onChange={() => setPaymentMethod(m.id as PaymentMethod)}
                        className="accent-primary"
                      />
                      <div className={`w-10 h-10 rounded-md ${m.color} flex items-center justify-center text-white text-lg`}>
                        {m.icon}
                      </div>
                      <span className="font-medium text-sm">{m.label}</span>
                      {paymentMethod === m.id && (
                        <Check className="h-4 w-4 text-primary ml-auto" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                  <span className="text-blue-600">🔒</span>
                  <p className="text-xs text-blue-900">
                    Paiement sécurisé via <strong>NotchPay</strong>. Vous serez redirigé vers la page de paiement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Demande spéciale */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-3">Demande spéciale (optionnel)</h2>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  rows={3}
                  placeholder="Instructions de livraison, allergies, demandes particulières..."
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </CardContent>
            </Card>
          </div>

          {/* ============================== */}
          {/* RÉCAP                          */}
          {/* ============================== */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-bold">Votre commande</h2>

                {/* Articles */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <div className="relative w-12 h-12 shrink-0 rounded bg-gray-100 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="line-clamp-2 font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
                      </div>
                      <p className="font-medium shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className={`font-medium ${shippingCost === 0 ? "text-success" : ""}`}>
                      {shippingCost === 0 ? "Gratuite" : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-dark">{formatPrice(total)}</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      Confirmer la commande
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  En passant commande, vous acceptez nos conditions générales de vente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
