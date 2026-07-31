# Guide Resend - Configuration pas-a-pas

## Pourquoi Resend ?

- Gratuit : **3000 emails/mois** (largement assez pour un portfolio)
- Simple : 1 cle API suffit
- Moderne : API REST propre
- Fiable : infrastructure AWS
- Docs excellentes : https://resend.com/docs

## PARTIE 1 : Creer un compte Resend (2 min)

### Etape 1.1 : Aller sur Resend

1. Ouvre https://resend.com
2. Clique **"Start Building"** ou **"Sign Up"**

### Etape 1.2 : S'inscrire

1. Choisis **"Continue with GitHub"** (le plus simple)
2. Autorise Resend a acceder a ton GitHub
3. Tu es connecte

### Etape 1.3 : Verifier ton email

1. Ouvre ta boite email
2. Clique sur le lien de verification de Resend
3. Retourne sur https://resend.com/dashboard

## PARTIE 2 : Obtenir une cle API (1 min)

### Etape 2.1 : Creer la cle

1. Sur le dashboard Resend : https://resend.com/api-keys
2. Clique **"Create API Key"**
3. Remplis :
   - **Name** : `ShopMax Production`
   - **Permission** : `Sending access` (Full access si dispo)
4. Clique **"Create"**
5. **COPIE LA CLE** (elle commence par `re_xxxxxxxxxxxx`)
6. **SAUVEGARDE-LA** dans un fichier texte (tu ne pourras plus la revoir)

> Ta cle ressemble a : `re_aBcDeFgHiJkLmNoPqRsTuVwXyZ_123456789`

## PARTIE 3 : Domaine (OPTIONNEL - pour l'instant)

### Option A : Utiliser le domaine sandbox (RECOMMANDE pour tester)

Tu peux envoyer des emails **MAIS** seulement vers ton propre email (l'adresse que tu as utilisée pour t'inscrire sur Resend).

Deja configure dans le code, rien a faire.

### Option B : Ajouter ton propre domaine (pour la prod)

1. Va sur https://resend.com/domains
2. Clique **"Add Domain"**
3. Tape ton domaine : `shopmax.cm` ou `shopmax.com`
4. Resend te donne des enregistrements DNS a ajouter
5. Va sur le site ou tu as achete le domaine (OVH, Namecheap, etc.)
6. Ajoute les enregistrements (TXT, CNAME, MX)
7. Attends 24-48h pour la propagation
8. Resend verifie automatiquement

> Pour l'instant, on va utiliser l'**Option A** (sandbox). Tu pourras ajouter un domaine plus tard.

## PARTIE 4 : Configurer le code backend

Le code est deja prepare. Il faut juste ajouter ta cle API.

### Etape 4.1 : Variable d'environnement locale (pour tester)

Sur ton PC, cree `backend/.env` (PAS sur GitHub) :

```env
Resend__ApiKey=re_ta_cle_api_ici
Resend__FromEmail=onboarding@resend.dev
Resend__FromName=ShopMax
```

### Etape 4.2 : Variable d'environnement Railway (pour la prod)

Sur Railway, ajoute ces 3 variables :

| Nom | Valeur |
|-----|--------|
| `Resend__ApiKey` | `re_ta_cle_api_ici` |
| `Resend__FromEmail` | `onboarding@resend.dev` |
| `Resend__FromName` | `ShopMax` |

## PARTIE 5 : Tester

### Test 1 : En local (si tu as .NET)

```bash
cd backend
dotnet run
```

Va sur `http://localhost:5000/swagger` > essaie `/api/EmailVerification/send`

### Test 2 : Sur Railway

1. Va sur `https://ton-backend.up.railway.app/swagger`
2. Essaie `/api/EmailVerification/send` avec ton email
3. Tu recois un vrai email !

### Test 3 : Sur Vercel (via le frontend)

Va sur `/inscription`, entre ton email, et tu recois le code dans ta vraie boite mail.

## PARTIE 6 : Verification

### Comment savoir si ca marche ?

1. Va sur https://resend.com/dashboard
2. Section **"Logs"** ou **"Activity"**
3. Tu vois tous les emails envoyes
4. Statut : Delivered / Bounced / Opened

### Emails testes possibles

Avec le sandbox, tu peux envoyer A :
- L'email que tu as utilise pour creer le compte Resend
- Pas aux autres emails (limitation du sandbox)

Pour envoyer a N'IMPORTE QUEL email :
- Il faut verifier un domaine (Option B)
- Ou passer au plan payant (10$/mois pour 50k emails)

## Limites du sandbox

| Limitation | Solution |
|------------|----------|
| Envoi seulement a ton email | Verifier un domaine ou plan payant |
| 100 emails/jour | Suffisant pour portfolio |
| Pas de tracking d'ouverture | Actif seulement en plan payant |
| Pas de suppression list | En production, gerer cote backend |

## Couts

- **Gratuit** : 3000 emails/mois (plan Free)
- **20$/mois** : 50k emails/mois (plan Pro)

Pour ton portfolio, **le plan gratuit suffit largement**.

## Maintenant, configure et dis-moi quand c'est fait !

J'attends que tu aies :
1. ✅ Cree le compte Resend
2. ✅ Obtenu la cle API
3. ✅ Ajoute les variables d'env (local et Railway)
4. ✅ Teste et recu un vrai email

Ensuite je t'aide a debugger si besoin.
