"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products as mockProducts, categories as mockCategories } from "@/lib/data";
import { useProducts } from "@/lib/hooks/use-products";
import { Loading } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";
import { formatPrice, getDiscountPercent } from "@/lib/utils";

export function CategoryListing({ slug = "all" }: { slug?: string }) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"popularity" | "price-asc" | "price-desc" | "newest">("popularity");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch depuis l'API
  const { data: apiProducts, isLoading, error, refetch } = useProducts({
    search: search || undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
    brand: selectedBrands[0], // Pour simplifier
    sortBy,
  });

  // Catégorie courante
  const category = useMemo(
    () => mockCategories.find((c) => c.slug === slug),
    [slug]
  );

  // Fallback : utilise les mocks si l'API ne répond pas
  const baseProducts = apiProducts && apiProducts.length > 0 ? apiProducts : mockProducts;

  // Filtrage local (catégorie + en stock)
  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    if (category && slug !== "all") {
      result = result.filter((p) => p.category === category.name);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    return result;
  }, [baseProducts, category, slug, inStockOnly]);

  const allBrands = useMemo(
    () => Array.from(new Set(baseProducts.map((p) => p.brand))).filter(Boolean),
    [baseProducts]
  );
  const allColors = ["Noir", "Blanc", "Bleu", "Or", "Gris"];
  const storageOptions = ["64 Go", "128 Go", "256 Go", "512 Go", "1 To"];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleStorage = (size: string) => {
    setSelectedStorage((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 2000000]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedStorage([]);
    setInStockOnly(false);
    setSearch("");
  };

  const activeFiltersCount =
    selectedBrands.length +
    selectedColors.length +
    selectedStorage.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 2000000 ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        {category ? (
          <>
            <Link href="/categories" className="hover:text-primary">Catégories</Link>
            <span className="mx-2">/</span>
            <span className="text-dark font-medium">{category.name}</span>
          </>
        ) : (
          <span className="text-dark font-medium">Tous les produits</span>
        )}
      </nav>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <FiltersContent
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            allBrands={allBrands}
            allColors={allColors}
            storageOptions={storageOptions}
            selectedBrands={selectedBrands}
            selectedColors={selectedColors}
            selectedStorage={selectedStorage}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            search={search}
            setSearch={setSearch}
            toggleBrand={toggleBrand}
            toggleColor={toggleColor}
            toggleStorage={toggleStorage}
            resetFilters={resetFilters}
            categories={mockCategories}
            currentSlug={slug}
          />
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Filtres</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <FiltersContent
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                allBrands={allBrands}
                allColors={allColors}
                storageOptions={storageOptions}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedStorage={selectedStorage}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                search={search}
                setSearch={setSearch}
                toggleBrand={toggleBrand}
                toggleColor={toggleColor}
                toggleStorage={toggleStorage}
                resetFilters={resetFilters}
                categories={mockCategories}
                currentSlug={slug}
              />
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {category?.name || "Tous les produits"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} produits trouvés
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="popularity">Trier par : Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <Loading text="Chargement des produits..." />
          ) : error && filteredProducts.length === 0 ? (
            <ErrorState onRetry={refetch} />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun produit ne correspond à vos critères.</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersContent({
  priceRange,
  setPriceRange,
  allBrands,
  allColors,
  storageOptions,
  selectedBrands,
  selectedColors,
  selectedStorage,
  inStockOnly,
  setInStockOnly,
  search,
  setSearch,
  toggleBrand,
  toggleColor,
  toggleStorage,
  resetFilters,
  categories,
  currentSlug,
}: any) {
  return (
    <div className="space-y-6">
      <FilterSection title="Recherche">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="h-9"
        />
      </FilterSection>

      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-3">Catégories</h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/boutique"
              className={`text-sm ${
                currentSlug === "all" ? "text-primary font-semibold" : "text-gray-700 hover:text-primary"
              }`}
            >
              Toutes les catégories
            </Link>
          </li>
          {categories.map((cat: any) => (
            <li key={cat.id}>
              <Link
                href={`/categories/${cat.slug}`}
                className={`text-sm flex justify-between ${
                  currentSlug === cat.slug
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs text-gray-400">({cat.productCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <FilterSection title="Prix">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000000"
            step="10000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-primary"
          />
        </div>
      </FilterSection>

      <FilterSection title="Marques">
        <div className="space-y-2">
          {allBrands.map((brand: string) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="rounded accent-primary"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Couleur">
        <div className="flex flex-wrap gap-2">
          {allColors.map((color: string) => {
            const colorMap: Record<string, string> = {
              Noir: "bg-black",
              Blanc: "bg-white border border-gray-300",
              Bleu: "bg-blue-600",
              Or: "bg-yellow-400",
              Gris: "bg-gray-400",
            };
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={`w-8 h-8 rounded-full ${colorMap[color]} ${
                  isSelected ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                title={color}
                aria-label={color}
              />
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Stockage">
        <div className="flex flex-wrap gap-2">
          {storageOptions.map((size: string) => {
            const isSelected = selectedStorage.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleStorage(size)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                  isSelected
                    ? "bg-primary border-primary text-dark"
                    : "bg-white border-gray-300 text-gray-700 hover:border-primary"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection title="Disponibilité">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded accent-primary"
          />
          <span>En stock uniquement</span>
        </label>
      </FilterSection>

      <Button variant="outline" className="w-full" onClick={resetFilters}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b">{title}</h4>
      {children}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const discount = product.oldPrice
    ? getDiscountPercent(product.oldPrice, product.price)
    : 0;

  return (
    <Card className="group overflow-hidden border-gray-200 hover:shadow-lg transition-all">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image unoptimized
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <Badge
            variant={product.badge === "NEW" ? "success" : "destructive"}
            className="absolute top-2 left-2"
          >
            {product.badge}
          </Badge>
        )}
        {discount > 0 && !product.badge && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            -{discount}%
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          <Link href={`/produit/${product.id}`}>{product.name}</Link>
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
          <span className="text-xs text-gray-500">({product.reviewsCount})</span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-dark">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        <Button className="w-full mt-4" size="sm">
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
}
