"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const faqCategories = [
  {
    title: "Commandes",
    questions: [
      {
        q: "Comment passer une commande ?",
        a: "C'est simple ! Parcourez notre catalogue, ajoutez les produits à votre panier, puis cliquez sur 'Passer la commande'. Renseignez vos informations de livraison et choisissez votre mode de paiement.",
      },
      {
        q: "Puis-je modifier ma commande après validation ?",
        a: "Vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été expédiée. Contactez notre support client dans les 2 heures suivant la commande.",
      },
      {
        q: "Comment suivre ma commande ?",
        a: "Dès que votre commande est confirmée, vous recevez un email avec un numéro de suivi. Vous pouvez aussi suivre votre colis depuis votre espace client ou notre page Suivi.",
      },
    ],
  },
  {
    title: "Livraison",
    questions: [
      {
        q: "Quels sont les délais de livraison ?",
        a: "La livraison prend généralement 2 à 3 jours ouvrés dans les grandes villes (Yaoundé, Douala) et 3 à 5 jours pour les autres villes du Cameroun.",
      },
      {
        q: "La livraison est-elle gratuite ?",
        a: "La livraison est gratuite pour toute commande supérieure ou égale à 50 000 FCFA. En dessous, les frais sont de 1 500 FCFA (à domicile) ou 500 FCFA (point relais).",
      },
      {
        q: "Livrez-vous hors du Cameroun ?",
        a: "Pour l'instant, nous livrons uniquement au Cameroun. Nous travaillons à étendre notre couverture à d'autres pays d'Afrique centrale.",
      },
    ],
  },
  {
    title: "Paiement",
    questions: [
      {
        q: "Quels sont les moyens de paiement acceptés ?",
        a: "Nous acceptons MTN Mobile Money, Orange Money, les cartes Visa et Mastercard, ainsi que le paiement à la livraison (espèces).",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui, tous les paiements sont sécurisés par NotchPay, notre partenaire de paiement certifié. Vos données bancaires ne sont jamais stockées sur nos serveurs.",
      },
      {
        q: "Puis-je payer à la livraison ?",
        a: "Oui, le paiement à la livraison est disponible. Vous payez en espèces directement au livreur lors de la réception de votre commande.",
      },
    ],
  },
  {
    title: "Retours et remboursements",
    questions: [
      {
        q: "Comment retourner un article ?",
        a: "Vous disposez de 30 jours après réception pour retourner un article. Contactez notre support pour initier un retour. Les frais de retour sont à notre charge en cas de défaut.",
      },
      {
        q: "Quand serai-je remboursé(e) ?",
        a: "Le remboursement est effectué sous 7 à 14 jours après réception et vérification de l'article retourné, via le même mode de paiement utilisé lors de l'achat.",
      },
    ],
  },
  {
    title: "Compte",
    questions: [
      {
        q: "Comment créer un compte ?",
        a: "Cliquez sur 'S'inscrire' en haut de la page, remplissez le formulaire avec vos informations, et validez. C'est gratuit et rapide !",
      },
      {
        q: "J'ai oublié mon mot de passe, que faire ?",
        a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">FAQ</span>
      </nav>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Foire aux questions</h1>
        <p className="text-gray-500">Trouvez rapidement des réponses à vos questions</p>
      </div>

      {/* Recherche */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une question..."
          className="pl-10 h-12"
        />
      </div>

      {/* Catégories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
            </CardContent>
          </Card>
        ) : (
          filteredCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <div className="space-y-2">
                {category.questions.map((item, index) => {
                  const key = `${category.title}-${index}`;
                  const isOpen = openItems[key];
                  return (
                    <Card key={key} className="overflow-hidden">
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium pr-4">{item.q}</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t">
                          {item.a}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CTA Contact */}
      <Card className="mt-12 bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Vous n&apos;avez pas trouvé votre réponse ?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Notre équipe support est disponible 24/7 pour vous aider.
          </p>
          <button
            className="bg-primary text-dark font-semibold px-6 py-2 rounded-md hover:bg-primary/90"
          >
            <Link href="/contact">Nous contacter</Link>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
