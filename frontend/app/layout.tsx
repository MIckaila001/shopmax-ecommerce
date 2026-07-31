import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/hooks/use-auth";
import { PWAProvider } from "@/components/pwa/pwa-provider";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export const metadata: Metadata = {
  title: "ShopMax - Shopping en ligne au Cameroun",
  description:
    "Découvrez le meilleur du shopping en ligne au Cameroun. Électronique, mode, maison, beauté et plus. Livraison rapide et paiement sécurisé.",
  keywords: "e-commerce, cameroun, shopping, mobile money, MTN, Orange Money",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopMax",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_CM",
    url: "https://shopmax.cm",
    siteName: "ShopMax",
    title: "ShopMax - Shopping au Cameroun",
    description: "Marketplace camerounaise avec Mobile Money",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#F5B400",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F5B400" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShopMax" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <PWAProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <InstallPrompt />
          </AuthProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
