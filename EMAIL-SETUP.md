# Configuration Email (Resend) - Guide complet

## Etat actuel

Pour l'instant, le systeme marche en **MODE DEMO** :
- Quand quelqu'un s'inscrit, le code OTP s'affiche directement sur la page
- Aucun email reel n'est envoye
- C'est parfait pour le developpement et la demonstration

**C'est volontaire et desire** pour l'instant.

## Comment activer les vrais emails plus tard

Quand tu seras pret a envoyer de vrais emails, voici comment faire :

---

## Option 1 : SANDBOX Resend (GRATUIT, sans domaine)

**Quand** : Aujourd'hui, demain, ou dans 6 mois - quand tu veux

**Cout** : 0 EUR (gratuit)

**Limites** :
- Tu peux envoyer SEULEMENT a l'email de ton compte Resend
- 100 emails/jour max
- 3000 emails/mois max

### Marche a suivre

#### Etape 1 : Creer un compte Resend (2 min)

1. Va sur https://resend.com
2. Clique "Start Building"
3. Choisis "Continue with GitHub"
4. Autorise Resend
5. Verifie ton email

#### Etape 2 : Obtenir la cle API (1 min)

1. Va sur https://resend.com/api-keys
2. Clique "Create API Key"
3. Name : "ShopMax"
4. Permission : "Sending access"
5. COPIE LA CLE (commence par `re_xxxxx`)
6. **SAUVEGARDE-LA** dans un fichier sur ton PC

#### Etape 3 : Ajouter la cle dans Railway

1. Va sur https://railway.app/dashboard
2. Clique sur ton projet `shopmax-ecommerce` (backend)
3. Onglet "Variables"
4. Ajoute 3 variables :

| Nom | Valeur |
|-----|--------|
| `Resend__ApiKey` | `re_ta_cle_ici` |
| `Resend__FromEmail` | `onboarding@resend.dev` |
| `Resend__FromName` | `ShopMax` |

5. Sauvegarde

#### Etape 4 : Tester

1. Va sur `https://ton-site.vercel.app/inscription`
2. Entre **ton email** (celui utilise pour Resend)
3. Verifie ta boite mail
4. Tu recois un vrai email avec le code !
5. Le code n'apparait plus en jaune (mode demo desactive)

---

## Option 2 : Domaine personnalise (POUR LE PORTFOLIO PRO)

**Quand** : Quand tu veux un portfolio qui en jette

**Cout** : ~10 EUR/an pour un `.com` ou `.cm`

**Avantages** :
- Email pro : `noreply@shopmax.com`
- Tu peux envoyer a N'IMPORTE QUI
- Plus serieux pour les recruteurs
- Domaine custom pour le site aussi : `https://shopmax.com`

### Marche a suivre

#### Etape 1 : Acheter un domaine

**Options recommandees** :
- **OVH** : `.cm` camerounais (ex: shopmax.cm) - ~10€/an
- **Namecheap** : `.com` - ~8€/an
- **Hostinger** : `.com` - ~9€/an
- **Google Domains** : `.com` - ~12€/an

Je recommande **`shopmax.cm`** (Cameroun) ou **`shopmax.com`** (international).

#### Etape 2 : Verifier le domaine dans Resend

1. Va sur https://resend.com/domains
2. Clique "Add Domain"
3. Tape : `shopmax.com` (ou `.cm`)
4. Resend te donne des **enregistrements DNS** a ajouter
5. Va sur le site ou tu as achete le domaine (OVH, etc.)
6. Ajoute les enregistrements (TXT, MX, CNAME)
7. **Attends 24-48h** pour la propagation DNS
8. Resend verifie automatiquement (statut "Verified")

#### Etape 3 : Mettre a jour Railway

Change la variable `Resend__FromEmail` :

| Nom | Valeur |
|-----|--------|
| `Resend__FromEmail` | `noreply@shopmax.com` (ton domaine) |

#### Etape 4 : Configurer le domaine sur Vercel (optionnel)

1. Vercel > ton projet > Settings > Domains
2. Ajoute `shopmax.com`
3. Vercel te donne des serveurs DNS
4. Va sur ton registrar et configure
5. Attends la propagation

---

## Cout total

| Option | Cout annuel | Avantages |
|--------|-------------|-----------|
| **Sandbox Resend** | **Gratuit** | Test immediat, ton propre email |
| **Domaine .com** | ~8-10 EUR | Pro, envoie a tout le monde |
| **Domaine .cm** | ~10-15 EUR | Camerounais, unique |

Pour un portfolio, le **domaine .com** ou **.cm** est **fortement recommande**.

---

## Tu peux faire les 2 dans cet ordre

1. **Aujourd'hui** : Sandbox Resend (test)
2. **Plus tard** : Domaine .com (quand tu as le budget)

Le code est deja pret pour les 2 cas. Il suffit juste d'ajouter la cle API et eventuellement le domaine.

---

## Resumé rapide

- **Pas de domaine** : Pas grave, on peut tester quand meme avec le sandbox
- **Plus tard** : Tu achetes un domaine (~10€) et tu l'ajoutes
- **Code deja pret** : Il suffit d'ajouter la variable d'env

## Quand tu es pret

Tu peux me dire "OK je veux configurer Resend" et je te guide etape par etape.

En attendant, le **mode demo** (code affiche en jaune) marche parfaitement pour le portfolio.
