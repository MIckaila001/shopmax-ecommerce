"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function AddToCart({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, getItemQuantity } = useCart();

  const cartQty = getItemQuantity(product.id);
  const totalPrice = product.price * quantity;

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/panier";
  };

  return (
    <div className="mt-6 space-y-3">
      {/* Quantité */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold">Quantité :</p>
        <div className="flex items-center border rounded-md">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Diminuer la quantité"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={increment}
            className="px-3 py-2 hover:bg-gray-100"
            aria-label="Augmenter la quantité"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {cartQty > 0 && (
          <span className="text-sm text-success font-medium">
            ({cartQty} dans le panier)
          </span>
        )}
      </div>

      {/* Prix total */}
      {quantity > 1 && (
        <p className="text-sm text-gray-600">
          Total : <span className="font-bold text-dark">{formatPrice(totalPrice)}</span>
        </p>
      )}

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
        <Button
          size="lg"
          onClick={handleBuyNow}
          className="w-full"
        >
          <Zap className="h-4 w-4 mr-2" />
          Acheter maintenant
        </Button>
      </div>
    </div>
  );
}
