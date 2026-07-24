import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  shopmax: {
    title: "À propos",
    links: [
      { label: "Qui sommes-nous", href: "/a-propos" },
      { label: "Nos engagements", href: "/engagements" },
      { label: "Carrières", href: "/carrieres" },
      { label: "Presse", href: "/presse" },
    ],
  },
  service: {
    title: "Service client",
    links: [
      { label: "Nous contacter", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Livraisons & retours", href: "/livraisons" },
      { label: "Suivi de commande", href: "/suivi" },
    ],
  },
  informations: {
    title: "Informations",
    links: [
      { label: "Conditions générales", href: "/cgv" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Politique de confidentialité", href: "/confidentialite" },
      { label: "Plan du site", href: "/sitemap" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter */}
        <div className="grid md:grid-cols-2 gap-8 pb-8 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold mb-2">Newsletter</h3>
            <p className="text-gray-400 text-sm">
              Recevez nos offres exclusives et nouveautés directement dans votre boîte mail.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Votre email"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 h-11"
            />
            <Button className="h-11 px-6">S'inscrire</Button>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold">Shop</span>
              <span className="text-2xl font-extrabold text-primary">Max</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Votre marketplace de confiance pour des produits de qualité à des prix imbattables.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact + copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> contact@shopmax.cm
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +237 6 XX XX XX XX
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Yaoundé, Cameroun
            </span>
          </div>
          <p className="text-sm text-gray-500">
            © 2024 ShopMax. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
