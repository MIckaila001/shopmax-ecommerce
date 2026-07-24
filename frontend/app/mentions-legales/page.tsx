import Link from "next/link";

export default function LegalNoticePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Mentions légales</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-8">Mentions Légales</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">1. Éditeur du site</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p><strong>Raison sociale :</strong> ShopMax SARL</p>
            <p><strong>Forme juridique :</strong> Société à responsabilité limitée</p>
            <p><strong>Capital social :</strong> 10 000 000 FCFA</p>
            <p><strong>Siège social :</strong> Carrefour Bastos, Yaoundé, Cameroun</p>
            <p><strong>RCCM :</strong> CM-YDE-01-2024-B-12345</p>
            <p><strong>NIU :</strong> M012345678901A</p>
            <p><strong>Téléphone :</strong> +237 6 00 00 00 00</p>
            <p><strong>Email :</strong> contact@shopmax.cm</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">2. Hébergement</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
            <p><strong>Hébergeur frontend :</strong> Vercel Inc.</p>
            <p className="text-gray-500">340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
            <p><strong>Hébergeur backend :</strong> Render Services, Inc.</p>
            <p className="text-gray-500">525 Brannan St, San Francisco, CA 94107, USA</p>
            <p><strong>Base de données :</strong> Neon (PostgreSQL serverless)</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">3. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu du site ShopMax (textes, images, logos, vidéos, icônes,
            sons, etc.) est la propriété exclusive de ShopMax SARL ou de ses partenaires.
            Toute reproduction, représentation ou diffusion, totale ou partielle, est
            interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">4. Responsabilité</h2>
          <p>
            ShopMax s&apos;efforce d&apos;assurer l&apos;exactitude des informations présentées
            sur le site. Toutefois, ShopMax ne saurait garantir l&apos;exhaustivité ou
            l&apos;absence d&apos;erreurs. L&apos;utilisation du site se fait sous la responsabilité
            de l&apos;utilisateur.
          </p>
          <p>
            ShopMax ne pourra être tenu responsable des dommages directs ou indirects
            résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">5. Cookies</h2>
          <p>
            Le site utilise des cookies pour améliorer l&apos;expérience utilisateur, analyser
            le trafic et personnaliser le contenu. Vous pouvez désactiver les cookies dans
            les paramètres de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">6. Droit applicable</h2>
          <p>
            Le présent site est soumis au droit camerounais. En cas de litige et après
            tentative de recherche d&apos;une solution amiable, les tribunaux camerounais
            seront seuls compétents pour connaître de ce litige.
          </p>
        </section>
      </div>
    </div>
  );
}
