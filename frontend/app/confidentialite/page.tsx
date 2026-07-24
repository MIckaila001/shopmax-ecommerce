import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Politique de confidentialité</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">Politique de confidentialité</h1>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 17 juillet 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">1. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Données d&apos;identification :</strong> nom, prénom, email, téléphone</li>
            <li><strong>Données de livraison :</strong> adresse, ville, code postal</li>
            <li><strong>Données de paiement :</strong> traitées exclusivement par NotchPay</li>
            <li><strong>Données de navigation :</strong> pages visitées, durée, appareil utilisé</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">2. Finalités d&apos;utilisation</h2>
          <p>Vos données sont utilisées pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Traiter et livrer vos commandes</li>
            <li>Gérer votre compte client</li>
            <li>Vous envoyer des communications relatives à vos commandes</li>
            <li>Améliorer nos services et votre expérience</li>
            <li>Vous proposer des offres personnalisées (avec votre consentement)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">3. Partage des données</h2>
          <p>
            Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Nos transporteurs pour la livraison</li>
            <li>Notre prestataire de paiement (NotchPay)</li>
            <li>Notre prestataire d&apos;emails (Resend)</li>
            <li>Les autorités légalement habilitées (sur demande)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">4. Sécurité</h2>
          <p>
            Nous mettons en œuvre toutes les mesures techniques et organisationnelles
            appropriées pour protéger vos données : chiffrement HTTPS, mots de passe hashés
            (bcrypt), accès restreint, sauvegardes régulières.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">5. Vos droits</h2>
          <p>Conformément à la loi, vous disposez à tout moment des droits suivants :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Droit à l&apos;effacement :</strong> supprimer vos données</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement</li>
            <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:privacy@shopmax.cm" className="text-primary hover:underline">
              privacy@shopmax.cm
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">6. Conservation des données</h2>
          <p>
            Vos données sont conservées pendant toute la durée de votre relation commerciale
            et pendant 3 ans après la dernière interaction. Les données de facturation sont
            conservées 10 ans pour des obligations comptables.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">7. Contact DPO</h2>
          <p>
            Pour toute question relative à vos données personnelles :{" "}
            <a href="mailto:dpo@shopmax.cm" className="text-primary hover:underline">
              dpo@shopmax.cm
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
