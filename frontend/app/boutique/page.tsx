import { CategoryListing } from "@/components/category/listing";
import { Reveal } from "@/components/ui/reveal";
import { Store, Sparkles } from "lucide-react";

export default function ShopPage() {
  return (
    <div>
      {/* HERO compact avec icone */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/5 to-transparent py-12 border-b">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  Boutique ShopMax
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold">Tous nos produits</h1>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-gray-600 max-w-2xl ml-[60px]">
              Découvrez notre catalogue complet avec filtres avancés, recherche intelligente et tris personnalisés.
            </p>
          </Reveal>
        </div>
      </section>

      <CategoryListing slug="all" />
    </div>
  );
}
