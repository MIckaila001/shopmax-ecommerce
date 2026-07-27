import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star } from "lucide-react";

export const metadata = {
  title: "ShopMax - Shopping en ligne au Cameroun",
  description: "Découvrez le meilleur du shopping en ligne au Cameroun. Électronique, mode, maison, beauté et plus.",
};

const CATEGORIES = [
  { name: "Téléphones", slug: "telephones", count: 142, image: "/images/categories/telephones.jpg" },
  { name: "Mode", slug: "mode", count: 89, image: "/images/categories/mode.jpg" },
  { name: "Beauté", slug: "beaute", count: 56, image: "/images/categories/beaute.jpg" },
  { name: "Maison", slug: "maison", count: 73, image: "/images/categories/maison.jpg" },
  { name: "Sport", slug: "sport", count: 34, image: "/images/categories/sport.jpg" },
  { name: "Alimentation", slug: "alimentaire", count: 28, image: "/images/categories/alimentaire.jpg" },
];

const FEATURED_PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", price: 850000, oldPrice: 950000, rating: 4.8, reviews: 124, image: "/images/products/iphone.jpg", badge: "NEW" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 750000, oldPrice: 820000, rating: 4.7, reviews: 89, image: "/images/products/samsung.jpg", badge: "-9%" },
  { id: 3, name: "AirPods Pro 2 USB-C", brand: "Apple", price: 195000, oldPrice: 220000, rating: 4.9, reviews: 256, image: "/images/products/airpods.jpg", badge: "-11%" },
  { id: 4, name: "MacBook Air M3 15 pouces", brand: "Apple", price: 1450000, oldPrice: 1600000, rating: 4.9, reviews: 67, image: "/images/products/laptop.svg", badge: "NEW" },
  { id: 5, name: "Nike Air Max 270 React", brand: "Nike", price: 95000, oldPrice: 120000, rating: 4.6, reviews: 178, image: "/images/products/sneakers.svg", badge: "-21%" },
  { id: 6, name: "Apple Watch Series 9", brand: "Apple", price: 320000, oldPrice: 380000, rating: 4.8, reviews: 145, image: "/images/products/watch.svg", badge: "-16%" },
  { id: 7, name: "Casque Sony WH-1000XM5", brand: "Sony", price: 280000, rating: 4.9, reviews: 203, image: "/images/products/headphones.svg", badge: null },
  { id: 8, name: "iPad Air M2 11 pouces", brand: "Apple", price: 580000, rating: 4.7, reviews: 98, image: "/images/products/tablette.svg", badge: "NEW" },
];

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getDiscount(oldPrice: number, price: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export default function HomePage() {
  const todayDeals = FEATURED_PRODUCTS.filter((p) => p.oldPrice);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                Bienvenue sur ShopMax
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Découvrez le meilleur du{" "}
                <span className="text-primary">shopping en ligne</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Des produits de qualité, au meilleur prix. Livraison rapide et
                paiement sécurisé partout au Cameroun.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/boutique"
                  className="inline-flex items-center justify-center rounded-md text-sm font-semibold bg-primary text-dark px-6 py-3 hover:bg-primary/90 transition"
                >
                  Explorer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/promotions"
                  className="inline-flex items-center justify-center rounded-md text-sm font-semibold border border-gray-300 px-6 py-3 hover:bg-gray-50 transition"
                >
                  Voir les offres
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Truck, label: "Livraison rapide", sub: "Partout au Cameroun" },
                  { icon: Shield, label: "Paiement sécurisé", sub: "100% sécurisé" },
                  { icon: RefreshCw, label: "Retour 30 jours", sub: "Satisfait ou remboursé" },
                  { icon: Headphones, label: "Support 24/7", sub: "À votre écoute" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2">
                    <item.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src="/images/hero/main.jpg"
                alt="ShopMax - Shopping au Cameroun"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATÉGORIES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Catégories populaires</h2>
              <p className="text-gray-500 mt-1">Explorez nos univers</p>
            </div>
            <Link
              href="/categories"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="group"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {cat.count} produits
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRES DU JOUR */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">Offres du jour</h2>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  HOT
                </span>
              </div>
              <p className="text-gray-500">
                Profitez de nos meilleurs prix avant la fin du compte à rebours
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Fin de l&apos;offre dans :</span>
              <div className="flex gap-1">
                {["08", "45", "32"].map((val, i) => (
                  <div key={i} className="bg-dark text-white px-3 py-2 rounded-md font-mono font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {todayDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS VEDETTES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tendances du moment</h2>
              <p className="text-gray-500 mt-1">Les produits les plus populaires</p>
            </div>
            <Link
              href="/boutique"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* BANNIÈRE PROMO MOBILE MONEY */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/banners/promo2.svg"
              alt="Paiement Mobile Money"
              width={1200}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Prêt à shopper ?
          </h2>
          <p className="text-dark/80 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de Camerounais qui font confiance à ShopMax
            pour leurs achats en ligne.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center justify-center rounded-md text-sm font-semibold bg-dark text-white px-8 py-4 hover:bg-dark/90 transition"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[number] }) {
  const discount = product.oldPrice ? getDiscount(product.oldPrice, product.price) : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
              product.badge === "NEW"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-dark">
            {formatPrice(product.price)} FCFA
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)} FCFA
            </span>
          )}
        </div>

        <Link
          href={`/produit/${product.id}`}
          className="block w-full mt-4 bg-primary text-dark text-center text-sm font-semibold py-2 rounded-md hover:bg-primary/90 transition"
        >
          Voir le produit
        </Link>
      </div>
    </div>
  );
}
