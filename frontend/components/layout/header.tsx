"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Menu, X, LogIn } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/hooks/use-cart";
import { useAuth } from "@/lib/hooks/use-auth";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique" },
  { label: "Catégories", href: "/categories" },
  { label: "Promotions", href: "/promotions" },
  { label: "Nouveautés", href: "/nouveautes" },
];

// Suggestions de recherche (top produits)
const SEARCH_SUGGESTIONS = [
  "iPhone 15 Pro",
  "Samsung Galaxy",
  "Nike Air Max",
  "MacBook",
  "AirPods Pro",
  "PlayStation 5",
  "Apple Watch",
  "Café Cameroun",
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions au clic dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = SEARCH_SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  ).slice(0, 5);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/boutique?search=${encodeURIComponent(searchQuery)}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top bar */}
      <div className="bg-dark text-white text-xs py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>📦 Livraison rapide partout au Cameroun</span>
          <span className="hidden md:inline">💬 Service client : +237 6 XX XX XX XX</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">Shop</span>
            <span className="text-2xl font-extrabold text-primary">Max</span>
          </Link>

          {/* Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Rechercher un produit, une marque..."
                  className="pl-10 h-11 w-full pr-4"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
            </form>

            {/* Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <Link
                    key={suggestion}
                    href={`/boutique?search=${encodeURIComponent(suggestion)}`}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery(suggestion);
                    }}
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/compte/favoris" aria-label="Favoris">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/panier" aria-label="Panier">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
                <Link href="/compte" aria-label="Mon compte">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/connexion">
                  <LogIn className="h-4 w-4 mr-1" />
                  Connexion
                </Link>
              </Button>
            )}

            {/* Mobile search */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Recherche"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile menu trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-8 mt-4 pt-4 border-t">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t bg-white p-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-10 h-11 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={isAuthenticated ? "/compte" : "/connexion"}
                className="text-sm font-medium text-gray-700 hover:text-primary py-2"
                onClick={() => setMobileOpen(false)}
              >
                {isAuthenticated ? `Mon compte (${user?.firstName})` : "Connexion"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
