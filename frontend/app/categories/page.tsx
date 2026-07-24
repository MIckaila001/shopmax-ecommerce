import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/data";

export default function AllCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Catégories</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Toutes les catégories</h1>
        <p className="text-gray-500 mt-2">Explorez l'ensemble de nos univers</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
          >
            <Image unoptimized
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <h3 className="text-xl font-bold mb-1">{cat.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-200">{cat.productCount} produits</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
