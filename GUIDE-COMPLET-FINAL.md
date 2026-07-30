# Guide Complet - Deployer ShopMax (GitHub + Vercel + Railway)

> Un seul guide pour tout deployer. Chaque clic est explique. Pour debutant absolu.
> Temps total : 30-45 minutes.

## Table des matieres

1. [Preparation : avoir le code](#1-preparation)
2. [Creer un compte GitHub](#2-github)
3. [Pousser le code sur GitHub](#3-push)
4. [Deployer le backend sur Railway](#4-railway)
5. [Deployer le frontend sur Vercel](#5-vercel)
6. [Connecter Vercel a Railway](#6-connect)
7. [Verifier que tout marche](#7-verify)
8. [Ajouter un domaine custom](#8-domaine)
9. [Mettre a jour le site](#9-update)

---

## 1. Preparation

### Ce dont tu as besoin

- [ ] Un PC Windows 10/11
- [ ] Une connexion internet
- [ ] Un email (Gmail, Outlook...)
- [ ] Le fichier `shopmax-site-mini.zip` (2.5 MB)
- [ ] Git installe (on l'installera ensemble)

### Etape 1.1 : Extraire le ZIP

1. Telecharge `shopmax-site-mini.zip` depuis l'interface Arena
2. Place-le sur ton **Bureau** (plus simple)
3. Clic droit > **"Extraire tout..."** (ou "Extract All...")
4. Choisis comme destination : `C:\Users\TonNom\Desktop\shopmax`
5. Coche **"Afficher les fichiers extraits"**
6. Clique **"Extraire"**

**Resultat** : Un dossier `shopmax` sur ton Bureau contenant :
- `frontend/` (le site)
- `backend/` (l'API)
- `README.md`
- `LICENSE`
- `.gitignore`
- Plusieurs guides `.md`

### Etape 1.2 : Installer Git (si pas deja fait)

1. Va sur https://git-scm.com/download/win
2. Le telechargement demarre automatiquement
3. Execute l'installeur
4. **Garde toutes les options par defaut** (clique Next a chaque fois)
5. A la fin, clique **"Finish"**

**Verification** :
1. Ouvre un terminal (Win+R > tape `cmd` > Entree)
2. Tape : `git --version`
3. Tu dois voir : `git version 2.42.0.windows.2` (ou similaire)

✅ **Preparation terminee**

---

## 2. Creer un compte GitHub

### Etape 2.1 : Creer le compte

1. Ouvre https://github.com
2. En haut a droite, clique **"Sign up"**
3. Remplis le formulaire :

| Champ | Valeur |
|-------|--------|
| **Email** | Ton email (ex: `ton.email@gmail.com`) |
| **Password** | Un mot de passe FORT (15+ caracteres, mix lettres/chiffres/symboles) |
| **Username** | **IMPORTANT** - C'est ton identifiant public. Choisis un nom professionnel (ex: `ismaila-bouba`). C'est ce que les recruteurs verront. |
| **Email preferences** | Depersonnalise si tu veux |
| **Verify** | Resous le puzzle CAPTCHA |

4. Clique **"Create account"**

### Etape 2.2 : Verifier ton email

1. Ouvre ta boite email
2. Tu recois un email de GitHub avec un code a 6 chiffres
3. Reviens sur GitHub
4. Entre le code
5. Clique **"Confirm"**

### Etape 2.3 : Repondre aux questions (ou skip)

GitHub te pose 2-3 questions. Tu peux cliquer **"Skip this for now"** partout.

### Etape 2.4 : Activer la 2FA (IMPORTANT)

1. En haut a droite, clique sur **ton avatar**
2. Menu > **"Settings"**
3. Menu gauche > **"Password and authentication"**
4. Section "Two-factor authentication" > **"Enable two-factor authentication"**
5. Choisis **"Set up using an app"**
6. Tu vois un **QR code**

**Sur ton telephone** :
- Si Android : telecharge **"Google Authenticator"** sur le Play Store
- Si iPhone : pareil sur l'App Store
- Ouvre l'app et **scanne le QR code**

7. L'app affiche un code a 6 chiffres qui change toutes les 30 secondes
8. Reviens sur GitHub, entre le code
9. **IMPORTANT** : GitHub te montre des **"Recovery codes"**
10. **Copie-les et sauvegarde-les** dans un fichier texte sur ton PC
11. Coche **"I've saved my recovery codes"**
12. Clique **"Enable"**

✅ **Compte GitHub cree et securise**

### Etape 2.5 : Creer un Personal Access Token

Tu vas avoir besoin de ce token pour pousser le code.

1. Va sur https://github.com/settings/tokens
2. **"Generate new token"** > **"Generate new token (classic)"**
3. GitHub demande peut-etre ton mot de passe + code 2FA

Remplis :
- **Note** : `ShopMax Deploy`
- **Expiration** : `90 days` (ou `No expiration` si tu preferes)
- **Coche UNIQUEMENT** la case **`repo`**

4. Clique **"Generate token"** (en bas)
5. **COPIE LE TOKEN** immediatement (Ctrl+C)
6. Colle-le dans un fichier texte sur ton Bureau : `github-token.txt`

**Ton token ressemble a** : `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`

> Si tu fermes la page, tu ne pourras plus voir le token !

✅ **Token cree**

---

## 3. Pousser le code sur GitHub

### Etape 3.1 : Creer le repository sur GitHub

1. Va sur https://github.com
2. En haut a droite, clique sur le **+**
3. Menu > **"New repository"**

Remplis :
- **Repository name** : `shopmax-ecommerce` (ou `shopmax`)
- **Description** : `Full-stack e-commerce platform for Cameroon - Next.js 15 + ASP.NET Core 10 + Flutter mobile app`
- **Visibilite** : Selectionne **`Public`** ✅
- **NE COCHE RIEN** (pas de README, pas de .gitignore, pas de licence)

4. Clique **"Create repository"**

GitHub t'affiche une page avec une URL :
```
https://github.com/ton-username/shopmax-ecommerce.git
```

**COPIE CETTE URL** (Ctrl+C) et garde-la.

### Etape 3.2 : Configurer Git (une seule fois)

1. Ouvre un terminal (Win+R > `cmd` > Entree)

2. Tape ces commandes (REMPLACE par tes infos) :

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@gmail.com"
```

### Etape 3.3 : Initialiser le repo et pousser le code

Dans le terminal, **va dans le dossier du projet** :

```bash
cd C:\Users\TonNom\Desktop\shopmax
```

> Adapte le chemin si tu as mis le dossier ailleurs.

Puis tape ces commandes **une par une** :

```bash
git init
```

> Cree un repo Git local

```bash
git add .
```

> Prepare tous les fichiers (le `.` est important)

```bash
git commit -m "Initial commit - ShopMax e-commerce platform"
```

> Cree le premier commit

```bash
git branch -M main
```

> Renomme la branche en "main"

```bash
git remote add origin https://github.com/ton-username/shopmax-ecommerce.git
```

> **REMPLACE** `ton-username` par ton vrai username et `shopmax-ecommerce` par le nom de ton repo

```bash
git push -u origin main
```

> Envoie le code sur GitHub

**Au prompt du mot de passe** :
- **Username** : tape ton username GitHub
- **Password** : **COLLE ton Personal Access Token** (PAS ton mot de passe GitHub)

**Tu dois voir a la fin** :
```
* [new branch]      main -> main
```

### Etape 3.4 : Verifier sur GitHub

1. Va sur `https://github.com/ton-username/shopmax-ecommerce`
2. Tu dois voir tous les fichiers :
   - `frontend/`
   - `backend/`
   - `README.md`
   - `LICENSE`
   - etc.

**Verifie que tu ne vois PAS** :
- `.env`
- `node_modules/`
- `bin/`
- `obj/`

Si tu vois ces fichiers, ton `.gitignore` n'a pas marche. Dis-le moi.

✅ **Code sur GitHub !**

---

## 4. Deployer le backend sur Railway

### Etape 4.1 : Creer un compte Railway

1. Va sur https://railway.app
2. En haut a droite, clique **"Login"**
3. Choisis **"Login with GitHub"**
4. Autorise Railway (nouvelle fenetre)

Si tu vois un formulaire d'onboarding :
- "What's your role?" → **"Developer"** ou **"Student"**
- "What are you building?" → Tape **"Portfolio"**
- Clique **"Continue"**

✅ **Compte Railway cree**

### Etape 4.2 : Creer un nouveau projet

1. Sur le dashboard Railway, clique **"+ New Project"** (en haut a droite)
2. Menu > **"Deploy from GitHub repo"**

**Si c'est ta premiere fois** :
- Une fenetre GitHub s'ouvre
- Selectionne **"Only select repositories"**
- En bas, coche **`shopmax-ecommerce`** (ton repo)
- Clique **"Install & Authorize"**

**Sinon** :
- Tu vois la liste de tes repos
- Selectionne **`ton-username/shopmax-ecommerce`**

3. Railway commence immediatement le deploiement
4. Tu vois des logs qui defilent : `Cloning...`, `Building...`, etc.

### Etape 4.3 : Renommer le service backend

1. Sur le service deploye, clique sur le nom (en haut, ex: "loving-vibrancy")
2. Renomme-le en **`shopmax-backend`**
3. Appuie Entree

### Etape 4.4 : Configurer le Root Directory (IMPORTANT)

1. Sur le service `shopmax-backend`, clique sur les **3 points "..."** (a droite)
2. **"Settings"**
3. Section **"Build"** ou **"Source"**
4. Trouve **"Root Directory"** ou **"Watch Paths"**
5. Change pour : `backend`
6. Sauvegarde

> Cette etape dit a Railway de chercher le Dockerfile dans `backend/`

### Etape 4.5 : Ajouter PostgreSQL

1. Sur ton projet Railway, tu vois ton service backend
2. En haut a droite, **"+ New"** (ou **"+ Add Service"**)
3. Menu > **"Database"** > **"PostgreSQL"**
4. Railway cree la BDD automatiquement

Tu vois maintenant **2 services** :
- `shopmax-backend`
- `Postgres` (ou un nom aleatoire)

### Etape 4.6 : Configurer les variables d'environnement

1. **Clique sur `shopmax-backend`**
2. Onglet **"Variables"** (en haut)

Tu vas ajouter **6 variables**, une par une. Pour chaque :

1. Clique **"+ New Variable"** ou le bouton **"RAW Editor"**
2. Entre le nom et la valeur
3. Clique **"Add"** ou **"Save"**

#### Variable 1 : Connection String a la BDD

**D'abord, recupere la connection string** :
1. Clique sur le service **PostgreSQL**
2. Onglet **"Variables"**
3. Tu vois **`DATABASE_URL`** = `postgresql://postgres:password@host:port/railway`
4. **Transforme-la** au format ASP.NET :
   ```
   Host=HOST;Port=PORT;Database=railway;Username=postgres;Password=PASSWORD
   ```

Par exemple, si `DATABASE_URL` est :
```
postgresql://postgres:abc123@monorail.proxy.rlwy.net:12345/railway
```

Transforme en :
```
Host=monorail.proxy.rlwy.net;Port=12345;Database=railway;Username=postgres;Password=abc123
```

Dans Railway :
- **Name** : `ConnectionStrings__DefaultConnection`
- **Value** : colle la version transformee

#### Variable 2 : JWT Secret (cle secrete)

- **Name** : `Jwt__Key`
- **Value** : `ShopMax2025_Ch4ng3_Th1s_S3cr3t_K3y_At_Le4st_32_Ch4r4ct3rs_L0ng!`

> Cette cle doit faire au moins 32 caracteres. Change-la en production.

#### Variable 3 : JWT Issuer

- **Name** : `Jwt__Issuer`
- **Value** : `ShopMax`

#### Variable 4 : JWT Audience

- **Name** : `Jwt__Audience`
- **Value** : `ShopMaxUsers`

#### Variable 5 : CORS - URL de ton futur site Vercel

- **Name** : `ALLOWED_ORIGINS`
- **Value** : `https://ton-site.vercel.app`
  > Remplace par ton vrai URL Vercel (on l'aura apres l'etape 5)

> **Astuce** : Si tu ne connais pas encore ton URL Vercel, mets : `https://example.com` pour l'instant, tu changeras apres

#### Variable 6 : Environment

- **Name** : `ASPNETCORE_ENVIRONMENT`
- **Value** : `Production`

### Etape 4.7 : Railway redéploie automatiquement

Quand tu ajoutes des variables, Railway redéploie.

**Attends 2-3 minutes**.

**Verifie** :
1. Sur le service backend, tu dois voir un **check vert** ou **cercle vert**
2. Onglet **"Logs"** : tu dois voir "ShopMax Backend PRET !"

### Etape 4.8 : Generer le domaine public

1. Sur le service `shopmax-backend`
2. Onglet **"Settings"**
3. Section **"Networking"** ou **"Domains"**
4. Clique **"Generate Domain"**

Railway te donne une URL :
```
https://shopmax-backend-production.up.railway.app
```

**COPIE CETTE URL**.

### Etape 4.9 : Tester le backend

Ouvre un navigateur et va a :

```
https://ton-backend.up.railway.app/health
```

**Tu dois voir** :
```json
{
  "status": "healthy",
  "time": "2025-07-28T...",
  "version": "1.0.0"
}
```

Si tu vois ca, **le backend est deploye et operationnel !**

**Test supplementaire** :
```
https://ton-backend.up.railway.app/health/detailed
```

Tu dois voir :
```json
{
  "status": "healthy",
  "database": "connected",
  "products": 10,
  "users": 1,
  "time": "..."
}
```

✅ **Backend deploye sur Railway !**

---

## 5. Deployer le frontend sur Vercel

### Etape 5.1 : Creer un compte Vercel

1. Va sur https://vercel.com
2. En haut a droite, clique **"Sign Up"**
3. Choisis **"Continue with GitHub"**
4. Autorise Vercel

✅ **Compte Vercel cree**

### Etape 5.2 : Importer le projet

1. Sur le dashboard Vercel, tu vois **"Let's build something new"**
2. En bas, section **"Import Git Repository"**
3. Cherche **`shopmax-ecommerce`**
4. **Si invisible** : clique **"Configure GitHub App"** > ajoute le repo > reviens
5. **Clique "Import"** sur ton projet

### Etape 5.3 : Configurer le projet

Sur l'ecran de configuration :

- **Project Name** : `shopmax-ecommerce` (ou ce que tu veux, ca sera l'URL)
- **Framework Preset** : `Next.js` (auto-detecte)
- **Root Directory** : **CLIQUE "Edit"** > tape **`frontend`** > Continue
  > **TRES IMPORTANT** sinon Vercel cherche Next.js a la racine
- **Build Command** : laisse vide
- **Output Directory** : laisse vide
- **Install Command** : laisse vide

**Ne clique PAS encore sur Deploy** !

### Etape 5.4 : Configurer Deployment Protection (PUBLIC ACCESS)

Pour que ton site soit visible publiquement (par les recruteurs) :

1. Va dans l'onglet **"Settings"** du projet
2. Menu gauche > **"Deployment Protection"**
3. Selectionne **"Public Access"** (ou desactive le toggle)
4. Sauvegarde

### Etape 5.5 : Deployer

Maintenant, **DEPLOY** :

1. Clique le gros bouton bleu **"Deploy"**
2. **Attends 2-3 minutes**
3. Tu dois voir "🎉 Congratulations!" avec des confettis
4. Vercel te donne une URL : `https://shopmax-ecommerce.vercel.app`

### Etape 5.6 : Tester

1. Clique sur l'URL
2. **Tu dois voir** la page d'accueil ShopMax
3. Navigue, teste les menus, les categories, etc.

✅ **Frontend deploye sur Vercel !**

---

## 6. Connecter Vercel a Railway

Maintenant on va dire a Vercel d'utiliser le backend Railway pour les appels API.

### Etape 6.1 : Ajouter la variable d'environnement

1. Sur Vercel, dans ton projet
2. **"Settings"** > **"Environment Variables"**
3. Clique **"Add New"** ou **"+ Add"**

- **Name** : `NEXT_PUBLIC_API_URL`
- **Value** : `https://ton-backend.up.railway.app/api`
  > **REMPLACE** par ton vrai URL Railway

4. **Coche les 3 cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique **"Save"**

### Etape 6.2 : Mettre a jour CORS sur Railway

Retourne sur Railway :

1. Service `shopmax-backend` > **"Variables"**
2. Modifie la variable **`ALLOWED_ORIGINS`**
3. Mets ton **vrai URL Vercel** : `https://shopmax-ecommerce.vercel.app`
4. Sauvegarde

### Etape 6.3 : Redeploy Vercel

1. Sur Vercel > onglet **"Deployments"**
2. Sur le dernier deploiement, clique les **3 points "..."**
3. **"Redeploy"**
4. Confirme
5. Attends 2-3 minutes

### Etape 6.4 : Verifier la connexion

1. Va sur `https://shopmax-ecommerce.vercel.app`
2. Ouvre la **console du navigateur** : `F12` > onglet **"Console"**
3. Tu ne dois **PAS** voir d'erreurs CORS rouges
4. Navigue sur le site, tout doit fonctionner

✅ **Vercel et Railway sont connectes !**

---

## 7. Verifier que tout marche

### Test 1 : Page d'accueil
- Va sur `https://ton-site.vercel.app`
- Tu vois la home avec les categories, produits, etc.

### Test 2 : Countdowns temps reel
- Les compteurs "00:00:00" doivent **bouger chaque seconde**

### Test 3 : Ventes Flash
- Section "Ventes Flash" avec produits et stock

### Test 4 : API backend
- Ouvre `https://ton-backend.up.railway.app/swagger`
- Liste de tous les endpoints

### Test 5 : Connexion admin
- Va sur `/connexion`
- Email : `admin@shopmax.cm`
- Password : `Admin123!`
- Tu dois etre connecte

### Test 6 : Health check
- `https://ton-backend.up.railway.app/health/detailed`
- Status : healthy, products : 10+

✅ **Si tout ca marche, c'est deploye !**

---

## 8. Ajouter un domaine custom (optionnel)

Au lieu de `shopmax-ecommerce.vercel.app`, tu peux avoir `shopmax.com` ou `shopmax.cm`.

### Ou acheter un domaine

- **Namecheap** : https://namecheap.com (~10$/an)
- **OVH** : https://ovh.com (francais)
- **GoDaddy** : https://godaddy.com
- **Hostinger** : https://hostinger.com

### Configurer sur Vercel

1. Achete le domaine
2. Vercel > ton projet > **Settings** > **Domains**
3. Tape ton domaine > **Add**
4. Vercel te donne des serveurs DNS (ex: `ns1.vercel-dns.com`)
5. Va sur le site ou tu as achete
6. Configure les DNS pour pointer vers Vercel
7. Attends 24-48h (propagation DNS)
8. HTTPS s'active automatiquement

---

## 9. Mettre a jour le site

### Quand tu modifies le code

**Sur ton PC** :
```bash
cd C:\Users\TonNom\Desktop\shopmax
```

Modifie les fichiers que tu veux (frontend ou backend).

Puis :
```bash
git add .
git commit -m "Description de ce que j'ai change"
git push
```

### Que se passe-t-il apres

- **Vercel detecte** le push et redeploie automatiquement (2-3 min)
- **Railway detecte** le push et redeploie aussi (2-3 min)
- **La BDD PostgreSQL** n'est pas affectee (sauf si tu changes le schema)

Pour les changements de **schema BDD** :
1. Modifie les modeles C# (`Models/`)
2. Cree une migration : `dotnet ef migrations add NomDeLaMigration`
3. Commit + push
4. Railway applique la migration automatiquement au demarrage

---

## Problemes courants et solutions

### "Permission denied" sur GitHub

**Cause** : Tu utilises un autre compte que le proprietaire du repo.

**Solution** :
```bash
git remote set-url origin https://ton-username:TON_TOKEN@github.com/ton-username/shopmax-ecommerce.git
```

### "404 NOT_FOUND" sur Vercel

**Cause** : Root Directory mal configure.

**Solution** : Settings > Build & Development Settings > Root Directory = `frontend`

### "Build failed" sur Railway

**Cause** : Dockerfile pas trouve ou erreur de code.

**Solution** : Settings > Root Directory = `backend`, verifie que `backend/Dockerfile` existe.

### "Database connection failed" sur Railway

**Cause** : Connection string incorrecte.

**Solution** : Verifie `ConnectionStrings__DefaultConnection` (format : `Host=...;Port=...;Database=railway;Username=postgres;Password=...`)

### "CORS error" depuis le navigateur

**Cause** : Vercel n'est pas dans la whitelist Railway.

**Solution** : Railway > service backend > Variables > `ALLOWED_ORIGINS` = `https://ton-site.vercel.app`

### "401 Unauthorized" sur les endpoints proteges

**Cause** : Token JWT manquant ou expire.

**Solution** : Connecte-toi d'abord, le token sera stocke et envoye automatiquement.

### "502 Bad Gateway" sur Railway

**Cause** : Le backend a plante au demarrage.

**Solution** : Railway > service backend > Logs > copie l'erreur.

---

## Checklist finale

Coche au fur et a mesure :

- [ ] ZIP extrait sur le Bureau
- [ ] Git installe et configure
- [ ] Compte GitHub cree + 2FA activee
- [ ] Personal Access Token cree
- [ ] Code pousse sur GitHub
- [ ] Compte Railway cree
- [ ] Projet deploye depuis GitHub
- [ ] PostgreSQL ajoute
- [ ] 6 variables d'environnement configurees
- [ ] Domaine Railway genere
- [ ] `/health` repond
- [ ] Compte Vercel cree
- [ ] Projet Vercel importe
- [ ] Root Directory = `frontend`
- [ ] Deployment Protection = Public Access
- [ ] Premier deploy reussi
- [ ] `NEXT_PUBLIC_API_URL` ajoute sur Vercel
- [ ] `ALLOWED_ORIGINS` mis a jour sur Railway
- [ ] Vercel redeploye
- [ ] Tout marche !

**Felicitations, tu as deploye une application full-stack professionnelle !** 🎉

---

## Cout

| Service | Plan | Cout |
|---------|------|------|
| GitHub | Public repo | Gratuit |
| Vercel | Hobby | Gratuit (suffisant) |
| Railway | Trial 5$ + 5$/mois | 0€ (trial) puis 5$/mois |
| PostgreSQL | Inclus Railway | 0€ (inclus) |
| **Total** | | **0€ le 1er mois** |

Pour un portfolio, **c'est 100% gratuit** (avec le credit Railway offert).

---

## URLs a sauvegarder

Note-les ici :

- **GitHub** : https://github.com/ton-username/shopmax-ecommerce
- **Vercel** : https://ton-site.vercel.app
- **Railway** : https://ton-backend.up.railway.app
- **Swagger** : https://ton-backend.up.railway.app/swagger
- **Admin** : admin@shopmax.cm / Admin123!

---

## Pour aller plus loin

- [ ] Ajouter un domaine custom
- [ ] Configurer les emails transactionnels (Resend)
- [ ] Ajouter Google Analytics
- [ ] Creer un dashboard admin
- [ ] Deployer l'app Flutter sur Play Store
- [ ] Ajouter la 2FA pour les users
- [ ] Configurer les backups BDD
- [ ] Mettre en place le monitoring (Sentry)

Bon courage et bravo pour ton portfolio ! 🚀
