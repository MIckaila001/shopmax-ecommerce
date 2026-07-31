import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Grid3X3 } from "lucide-react";
import { categories } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

export default function AllCategoriesPage() {
  return (
    <div>
      {/* HERO avec image */}
      <section className="relative h-[350px] overflow-hidden">
        <Image
          src="/images/categories/mode.jpg"
          alt="Toutes les catégories"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                <Grid3X3 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary">6 UNIVERS</span>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                Toutes les catégories
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-lg text-gray-200">
                Explorez l'ensemble de nos univers et trouvez ce qui vous correspond
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Grille de catégories avec images */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                <span className="font-bold text-2xl text-dark">{categories.length}</span> catégories disponibles
              </p>
            </div>
          </Reveal>

          <Reveal stagger>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <Image unoptimized
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Badge de réduction */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse-glow">
                    -{Math.floor(Math.random() * 30 + 10)}%
                  </div>

                  {/* Contenu */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <h3 className="text-2xl font-extrabold mb-1 group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-200">
                        {cat.productCount} produits
                      </span>
                      <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                        Explorer
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bandeau promo */}
      <section className="py-12 bg-gradient-to-r from-primary to-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark mb-3">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-dark/80 mb-6 max-w-2xl mx-auto">
              Contactez notre service client, nous avons peut-être exactement ce qu'il vous faut !
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-lg font-bold hover:bg-dark/90 transition"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
