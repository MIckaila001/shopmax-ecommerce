import Link from "next/link";

export default function CGVPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-dark font-medium">Conditions générales de vente</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold mb-2">Conditions Générales de Vente</h1>
      <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 17 juillet 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">1. Préambule</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent l&apos;ensemble des transactions
            effectuées sur le site ShopMax.cm, exploité par ShopMax SARL, société de droit
            camerounais, immatriculée au RCCM de Yaoundé sous le numéro CM-YDE-01-2024-B-12345.
          </p>
          <p>
            Toute commande passée sur le site implique l&apos;acceptation sans réserve des
            présentes CGV par le client.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">2. Produits et prix</h2>
          <p>
            Les produits proposés à la vente sont décrits et présentés avec la plus grande
            exactitude possible. Les prix sont indiqués en francs CFA (XAF), toutes taxes
            comprises (TTC). Les frais de livraison sont indiqués avant la validation de la commande.
          </p>
          <p>
            ShopMax se réserve le droit de modifier ses prix à tout moment, les produits
            étant facturés sur la base du tarif en vigueur au moment de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">3. Commande</h2>
          <p>
            Le client passe commande en suivant le processus suivant :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ajout des produits au panier</li>
            <li>Renseignement des informations de livraison</li>
            <li>Choix du mode de paiement</li>
            <li>Validation et paiement</li>
          </ul>
          <p>
            La commande est réputée acceptée à la réception du paiement. Un email de
            confirmation est envoyé au client.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">4. Paiement</h2>
          <p>Les modes de paiement acceptés sont :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>MTN Mobile Money</li>
            <li>Orange Money</li>
            <li>Cartes bancaires (Visa, Mastercard)</li>
            <li>Paiement à la livraison (espèces)</li>
          </ul>
          <p>
            Les transactions sont sécurisées par notre partenaire <strong>NotchPay</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">5. Livraison</h2>
          <p>
            Les commandes sont livrées à l&apos;adresse indiquée par le client lors de la commande.
            Les délais de livraison sont de 2 à 3 jours ouvrés pour les grandes villes
            (Yaoundé, Douala) et de 3 à 5 jours pour les autres localités.
          </p>
          <p>
            La livraison est <strong>gratuite pour toute commande supérieure ou égale à 50 000 FCFA</strong>.
            En dessous, les frais sont de 1 500 FCFA (domicile) ou 500 FCFA (point relais).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">6. Droit de rétractation</h2>
          <p>
            Conformément à la réglementation en vigueur, le client dispose d&apos;un délai de
            <strong> 30 jours</strong> à compter de la réception pour exercer son droit de
            rétractation, sans avoir à motiver sa décision.
          </p>
          <p>
            Les produits doivent être retournés dans leur état d&apos;origine, complets et
            non utilisés. Les frais de retour sont à la charge du client, sauf en cas de
            produit défectueux.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">7. Garanties</h2>
          <p>
            Tous nos produits bénéficient de la garantie légale de conformité (2 ans) et de
            la garantie contre les vices cachés, conformément au Code civil camerounais.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">8. Protection des données</h2>
          <p>
            Les données personnelles collectées sont nécessaires au traitement des commandes
            et à la relation client. Conformément à la loi camerounaise sur la protection
            des données, vous disposez d&apos;un droit d&apos;accès, de rectification et de
            suppression de vos données.
          </p>
          <p>
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@shopmax.cm" className="text-primary hover:underline">contact@shopmax.cm</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">9. Réclamations</h2>
          <p>
            Toute réclamation doit être adressée par email à <a href="mailto:reclamations@shopmax.cm" className="text-primary hover:underline">reclamations@shopmax.cm</a>
            dans un délai de 30 jours suivant la commande. Une réponse sera apportée dans
            les meilleurs délais.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mt-8 mb-3 text-dark">10. Droit applicable et juridiction</h2>
          <p>
            Les présentes CGV sont régies par le droit camerounais. En cas de litige, les
            tribunaux de Yaoundé seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
