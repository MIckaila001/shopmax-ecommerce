import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Countdown } from "./ui/countdown";

// Donnees statiques (pas d'appel API, pas de bug)
const PROMOS = [
  {
    id: 1,
    title: "MEGA SOLDES D'ÉTÉ",
    subtitle: "Sur toute la collection Mode",
    description: "Profitez de remises exceptionnelles sur les marques les plus populaires.",
    ctaText: "Découvrir",
    ctaLink: "/boutique",
    discountPercent: 50,
    endDate: "2025-12-31T23:59:59.000Z",
  },
  {
    id: 2,
    title: "PROMO TECH -30%",
    subtitle: "iPhone, Samsung, MacBook",
    description: "Les meilleurs prix sur l'électronique haut de gamme.",
    ctaText: "Voir la sélection",
    ctaLink: "/categories/electronique",
    discountPercent: 30,
    endDate: "2025-12-31T23:59:59.000Z",
  },
  {
    id: 3,
    title: "LIVRAISON GRATUITE",
    subtitle: "Sur toute la première commande",
    description: "Utilisez le code BIENVENUE10 à la validation.",
    ctaText: "En profiter",
    ctaLink: "/inscription",
    discountPercent: 10,
    endDate: "2025-12-31T23:59:59.000Z",
  },
];

// Banniere promo 100% Server Component (pas de bug)
// Affiche les 3 promos en pile, l'utilisateur peut cliquer
export function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PROMOS.map((promo) => (
        <div
          key={promo.id}
          className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-yellow-400 to-primary p-6 relative shadow-lg hover:shadow-xl transition-shadow"
        >
          {/* Pattern décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-dark" />
              <span className="text-xs font-bold text-dark uppercase tracking-wider">
                {promo.discountPercent > 0 ? `-${promo.discountPercent}%` : "Offre spéciale"}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-dark mb-1">
              {promo.title}
            </h3>
            <p className="text-dark/80 text-sm mb-2">{promo.subtitle}</p>

            <div className="flex items-center gap-2 mb-4 text-xs">
              <span className="text-dark/80 font-semibold">Expire dans :</span>
              <Countdown endsAt={promo.endDate} compact />
            </div>

            <Link
              href={promo.ctaLink}
              className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-dark text-primary px-4 py-2 hover:bg-dark/90 transition"
            >
              {promo.ctaText}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
