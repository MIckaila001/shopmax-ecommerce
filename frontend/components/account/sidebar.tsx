"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  CreditCard,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/compte", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/compte/commandes", label: "Mes commandes", icon: Package },
  { href: "/compte/adresses", label: "Mes adresses", icon: MapPin },
  { href: "/compte/profil", label: "Informations personnelles", icon: User },
  { href: "/compte/paiement", label: "Moyens de paiement", icon: CreditCard },
  { href: "/compte/favoris", label: "Mes favoris", icon: Heart },
  { href: "/compte/parametres", label: "Paramètres", icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
  };

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="bg-white border rounded-2xl overflow-hidden">
        {/* User info */}
        <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-dark font-bold flex items-center justify-center text-lg">
              {getInitials()}
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Invité"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-dark"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t my-2" />

          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-destructive"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Déconnexion
          </Button>
        </nav>
      </div>
    </aside>
  );
}
