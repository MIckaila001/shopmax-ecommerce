import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Countdown } from "./ui/countdown";

// Promos statiques (pas d'appel API, pas de bug)
// Les dates sont calculees une seule fois au build du serveur
const now = Date.now();
const PROMOS = [
  {
    id: 1,
    title: "MEGA SOLDES",
    subtitle: "Collection Mode",
    description: "Jusqu'à -50% sur les meilleures marques",
    ctaText: "Voir",
    ctaLink: "/boutique",
    discountPercent: 50,
    endDate: new Date(now + 23 * 60 * 60 * 1000).toISOString(), // dans 23h
  },
  {
    id: 2,
    title: "PROMO TECH",
    subtitle: "High-tech à prix cassés",
    description: "iPhone, Samsung, MacBook en promo",
    ctaText: "Découvrir",
    ctaLink: "/categories/electronique",
    discountPercent: 30,
    endDate: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(), // dans 2 jours
  },
  {
    id: 3,
    title: "LIVRAISON OFFERTE",
    subtitle: "Sur votre première commande",
    description: "Code BIENVENUE10 à la validation",
    ctaText: "En profiter",
    ctaLink: "/inscription",
    discountPercent: 10,
    endDate: new Date(now + 6 * 24 * 60 * 60 * 1000).toISOString(), // dans 6 jours
  },
];

/**
 * Banniere promo 100% Server Component
 * 3 promos affichees en grille, chacune avec un countdown
 * Le countdown se met a jour cote client
 */
export function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PROMOS.map((promo) => (
        <div
          key={promo.id}
          className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-yellow-400 to-primary p-5 relative shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-dark" />
              <span className="text-xs font-bold text-dark uppercase tracking-wider">
                {promo.discountPercent > 0 ? `-${promo.discountPercent}%` : "Offre"}
              </span>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-dark mb-1">
              {promo.title}
            </h3>
            <p className="text-dark/80 text-sm mb-3">{promo.subtitle}</p>

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
