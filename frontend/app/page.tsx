import Link from "next/link";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, Zap } from "lucide-react";

export const metadata = {
  title: "ShopMax - Shopping en ligne au Cameroun",
  description: "Découvrez le meilleur du shopping en ligne au Cameroun.",
};

const CATEGORIES = [
  { name: "Téléphones", slug: "telephones", count: 142, emoji: "📱" },
  { name: "Mode", slug: "mode", count: 89, emoji: "👕" },
  { name: "Beauté", slug: "beaute", count: 56, emoji: "💄" },
  { name: "Maison", slug: "maison", count: 73, emoji: "🏠" },
  { name: "Sport", slug: "sport", count: 34, emoji: "⚽" },
  { name: "Alimentation", slug: "alimentaire", count: 28, emoji: "🍎" },
];

const PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro Max 256GB", brand: "Apple", price: 850000, oldPrice: 950000, rating: 4.8, reviews: 124, badge: "NEW", emoji: "📱" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 750000, oldPrice: 820000, rating: 4.7, reviews: 89, badge: "-9%", emoji: "📱" },
  { id: 3, name: "AirPods Pro 2 USB-C", brand: "Apple", price: 195000, oldPrice: 220000, rating: 4.9, reviews: 256, badge: "-11%", emoji: "🎧" },
  { id: 4, name: "MacBook Air M3 15 pouces", brand: "Apple", price: 1450000, oldPrice: 1600000, rating: 4.9, reviews: 67, badge: "NEW", emoji: "💻" },
  { id: 5, name: "iPad Air M2 11 pouces", brand: "Apple", price: 580000, rating: 4.7, reviews: 98, badge: "NEW", emoji: "📱" },
  { id: 6, name: "PlayStation 5 Slim", brand: "Sony", price: 480000, oldPrice: 520000, rating: 4.9, reviews: 312, badge: "-8%", emoji: "🎮" },
  { id: 7, name: "Canon EOS R6 Mark II", brand: "Canon", price: 1850000, rating: 4.8, reviews: 45, badge: "NEW", emoji: "📷" },
  { id: 8, name: "Smart TV 4K 55 pouces", brand: "Samsung", price: 420000, oldPrice: 480000, rating: 4.6, reviews: 156, badge: "-13%", emoji: "📺" },
  { id: 9, name: "Nike Air Max 270 React", brand: "Nike", price: 95000, oldPrice: 120000, rating: 4.6, reviews: 178, badge: "-21%", emoji: "👟" },
  { id: 10, name: "Robe Africaine Élégante", brand: "ShopMax Couture", price: 35000, oldPrice: 45000, rating: 4.8, reviews: 89, badge: "-22%", emoji: "👗" },
  { id: 11, name: "Veste à Capuche Premium", brand: "Urban Style", price: 28000, rating: 4.5, reviews: 67, badge: "NEW", emoji: "🧥" },
  { id: 12, name: "Sac à Main en Cuir", brand: "Luxury Bag", price: 42000, oldPrice: 55000, rating: 4.7, reviews: 134, badge: "-24%", emoji: "👜" },
  { id: 13, name: "Apple Watch Series 9", brand: "Apple", price: 320000, oldPrice: 380000, rating: 4.8, reviews: 145, badge: "-16%", emoji: "⌚" },
  { id: 14, name: "Eau de Parfum ShopMax", brand: "ShopMax Beauty", price: 18500, oldPrice: 25000, rating: 4.9, reviews: 234, badge: "-26%", emoji: "🌸" },
  { id: 15, name: "Crème Hydratante Visage", brand: "Natural Care", price: 12000, rating: 4.6, reviews: 167, badge: null, emoji: "🧴" },
  { id: 16, name: "Casque Sony WH-1000XM5", brand: "Sony", price: 280000, rating: 4.9, reviews: 203, badge: null, emoji: "🎧" },
  { id: 17, name: "Lampe de Table LED Design", brand: "HomeLight", price: 15000, oldPrice: 22000, rating: 4.7, reviews: 78, badge: "-32%", emoji: "💡" },
  { id: 18, name: "Set de 3 Coussins Décoratifs", brand: "Deco Home", price: 18000, rating: 4.5, reviews: 56, badge: "NEW", emoji: "🛋️" },
  { id: 19, name: "Ballon de Football Taille 5", brand: "Adidas", price: 18000, oldPrice: 25000, rating: 4.8, reviews: 245, badge: "-28%", emoji: "⚽" },
  { id: 20, name: "Tapis de Yoga Premium", brand: "YogaLife", price: 22000, rating: 4.7, reviews: 134, badge: null, emoji: "🧘" },
  { id: 21, name: "Café Moulu Arabica 250g", brand: "Café Cameroun", price: 4500, oldPrice: 6000, rating: 4.9, reviews: 312, badge: "-25%", emoji: "☕" },
  { id: 22, name: "Jus de Mangue Naturel 1L", brand: "Fruits du Cameroun", price: 2500, rating: 4.7, reviews: 189, badge: null, emoji: "🥭" },
  { id: 23, name: "Riz Basmati 5kg Premium", brand: "ShopMax Grocery", price: 8500, oldPrice: 10000, rating: 4.6, reviews: 98, badge: "-15%", emoji: "🍚" },
  { id: 24, name: "Huile de Palme Bio 1L", brand: "Terroir Local", price: 3500, rating: 4.8, reviews: 167, badge: null, emoji: "🫒" },
];

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function getDiscount(oldPrice: number, price: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export default function HomePage() {
  const todayDeals = PRODUCTS.filter((p) => p.oldPrice).slice(0, 8);
  const trending = PRODUCTS.slice(0, 8);
  const newArrivals = PRODUCTS.filter((p) => p.badge === "NEW").slice(0, 4);

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
                Plus de 400 produits, des prix imbattables. Livraison rapide et
                paiement Mobile Money partout au Cameroun.
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
                  Voir les promos
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

            <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-primary flex items-center justify-center">
              <span className="text-9xl font-extrabold text-dark">SM</span>
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
              <p className="text-gray-500 mt-1">Explorez nos 6 univers</p>
            </div>
            <Link href="/categories" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-primary/10 hover:bg-primary/20 transition flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">
                    {cat.emoji}
                  </span>
                </div>
                <div className="mt-3 text-center">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-gray-500">{cat.count} produits</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VENTES FLASH */}
      <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-red-500 fill-red-500" />
            <h2 className="text-3xl font-bold text-dark">Ventes Flash</h2>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
          </div>
          <p className="text-gray-600 mb-8">Offres limitées - Stock limité</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {todayDeals.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
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
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">HOT</span>
              </div>
              <p className="text-gray-500">Profitez de nos meilleurs prix</p>
            </div>
            <Link href="/boutique" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {todayDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-3xl font-bold">Nouveautés</h2>
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
              </div>
              <p className="text-gray-500 mt-1">Les derniers produits ajoutés</p>
            </div>
            <Link href="/boutique" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* TENDANCES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Tendances du moment</h2>
              <p className="text-gray-500 mt-1">Les produits les plus populaires</p>
            </div>
            <Link href="/boutique" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* BANNIÈRE MOBILE MONEY */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-dark to-gray-800 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              PAIEMENT MOBILE MONEY
            </h2>
            <p className="text-white text-lg mb-6">
              MTN MoMo • Orange Money • Paiement à la livraison
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="bg-yellow-400 text-dark px-4 py-2 rounded-lg font-bold">MTN MoMo</span>
              <span className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">Orange Money</span>
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">Cash livraison</span>
            </div>
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

function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  const discount = product.oldPrice ? getDiscount(product.oldPrice, product.price) : 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
          {product.emoji}
        </span>
        {product.badge && (
          <span
            className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
              product.badge === "NEW" ? "bg-green-500 text-white" : "bg-red-500 text-white"
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
                  i < Math.floor(product.rating) ? "fill-primary text-primary" : "fill-gray-200 text-gray-200"
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
