"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Countdown } from "./ui/countdown";
import { Sparkles } from "lucide-react";

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  endsAt: string;
  ctaText: string;
  ctaLink: string;
  discountPercent: number;
}

interface PromoBannerProps {
  initialPromos?: Promo[];
}

/**
 * Bannière promo avec countdown temps réel
 * Recupere les promos depuis l'API backend
 */
export function PromoBanner({ initialPromos = [] }: PromoBannerProps) {
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch promos from API
  useEffect(() => {
    async function loadPromos() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/promotions/active`, {
          // Cache 60s
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = await res.json();
          setPromos(data);
        } else {
          // Fallback sur les promos initiales
          setPromos(getFallbackPromos());
        }
      } catch (err) {
        // API non dispo, fallback
        setPromos(getFallbackPromos());
      } finally {
        setLoading(false);
      }
    }

    loadPromos();
  }, []);

  // Rotation auto toutes les 8 secondes
  useEffect(() => {
    if (promos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [promos.length]);

  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-yellow-300 p-8 h-48 flex items-center justify-center">
        <div className="animate-pulse text-dark font-semibold">Chargement des promos...</div>
      </div>
    );
  }

  if (promos.length === 0) {
    return null;
  }

  const current = promos[currentIndex];

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-primary via-yellow-400 to-primary p-6 md:p-10 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-dark" />
            <span className="text-xs font-bold text-dark uppercase tracking-wider">
              {current.discountPercent > 0 ? `-${current.discountPercent}%` : "Offre spéciale"}
            </span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold text-dark mb-2">
            {current.title}
          </h2>
          <p className="text-dark/80 text-sm md:text-base mb-1">
            {current.subtitle}
          </p>
          <p className="text-dark/70 text-xs md:text-sm mb-6">
            {current.description}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-dark/80 font-semibold">Expire dans :</span>
            <Countdown endsAt={current.endsAt} variant="default" />
          </div>

          <Link
            href={current.ctaLink}
            className="inline-flex items-center justify-center rounded-md text-sm font-bold bg-dark text-primary px-6 py-3 hover:bg-dark/90 transition"
          >
            {current.ctaText}
          </Link>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="w-48 h-48 lg:w-64 lg:h-64 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl lg:text-7xl font-extrabold text-dark">
                -{current.discountPercent}%
              </div>
              <div className="text-sm text-dark/80 font-semibold mt-1">
                sur la sélection
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs de pagination */}
      {promos.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {promos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? "w-8 bg-dark" : "w-2 bg-dark/30"
              }`}
              aria-label={`Voir promo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getFallbackPromos(): Promo[] {
  // Fallback si l'API ne repond pas
  const now = Date.now();
  return [
    {
      id: 1,
      title: "MEGA SOLDES D'ÉTÉ",
      subtitle: "Sur toute la collection Mode",
      description: "Profitez de remises exceptionnelles sur les marques les plus populaires.",
      imageUrl: "/images/banners/promo1.svg",
      endsAt: new Date(now + 8 * 60 * 60 * 1000 + 45 * 60 * 1000 + 32 * 1000).toISOString(),
      ctaText: "Découvrir",
      ctaLink: "/promotions",
      discountPercent: 50,
    },
    {
      id: 2,
      title: "PROMO TECH -30%",
      subtitle: "iPhone, Samsung, MacBook",
      description: "Les meilleurs prix sur l'électronique haut de gamme.",
      imageUrl: "/images/banners/promo2.svg",
      endsAt: new Date(now + 3 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
      ctaText: "Voir la sélection",
      ctaLink: "/categories/telephones",
      discountPercent: 30,
    },
    {
      id: 3,
      title: "LIVRAISON GRATUITE",
      subtitle: "Sur toute la premiere commande",
      description: "Utilisez le code BIENVENUE10 à la validation.",
      imageUrl: "/images/banners/promo1.svg",
      endsAt: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(),
      ctaText: "En profiter",
      ctaLink: "/inscription",
      discountPercent: 10,
    },
  ];
}
