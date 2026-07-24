# Guide Complet : GitHub + Vercel (etape par etape)

> Guide pour debutant absolu. Chaque clic est detaille.
> Temps total : 20-30 minutes.

---

## PARTIE 1 : Creer un compte GitHub (5 min)

### Etape 1.1 : Aller sur GitHub

1. Ouvre ton navigateur (Chrome, Firefox, Edge...)
2. Dans la barre d'adresse en haut, tape :
   ```
   github.com
   ```
3. Appuie sur **Entree**

### Etape 1.2 : Cliquer sur "Sign up"

Tu vois en haut a droite un bouton **Sign up**. Clique dessus.

### Etape 1.3 : Remplir le formulaire d'inscription

Tu arrives sur une page avec un formulaire. Remplis :

| Champ | Ce que tu mets | Exemple |
|-------|----------------|---------|
| **Email** | Ton email | `ton.email@gmail.com` |
| **Password** | Un mot de passe fort (min 15 caracteres, mix lettres/chiffres/symboles) | `ShopMax2025!Portfolio` |
| **Username** | Ton nom d'utilisateur (PUBLIC, les recruteurs le verront) | `ismaila-bouba` |
| **Email preferences** | Coche ou decoche les news | A ton choix |
| **Verify** | Coche la case CAPTCHA | - |

Puis clique sur le bouton vert **Create account**.

### Etape 1.4 : Verifier ton email

1. Ouvre ta boite email (Gmail, Outlook...)
2. Tu recois un email de GitHub avec un code a 6 chiffres
3. Reviens sur la page GitHub
4. Entre le code dans le champ demande
5. Clique **Confirm**

### Etape 1.5 : Repondre aux questions d'onboarding

GitHub te pose quelques questions (tu peux skip) :
- "How many team members?" → Choisis **Just me**
- "What kind of work?" → Coche **Student** ou **Professional**
- "Which features interest you?" → Coche ce que tu veux

Tu peux aussi cliquer **Skip this for now** pour aller plus vite.

### Etape 1.6 : Page d'accueil

Tu arrives sur le dashboard GitHub. Pour l'instant il est vide (tu n'as pas encore de repo).

✅ **Compte GitHub cree !**

### Etape 1.7 : Activer la 2FA (IMPORTANT - 2 min)

> Sans la 2FA, tu ne pourras pas utiliser Git en ligne de commande apres 2023.

1. En haut a droite, clique sur **ton avatar** (image de profil)
2. Menu deroulant → **Settings**
3. Dans le menu a gauche, descend et clique **Password and authentication**
4. Section "Two-factor authentication" → **Enable two-factor authentication**
5. Choisis **Set up using an app**
6. Tu vois un QR code
7. Sur ton telephone :
   - Si tu as un iPhone : telecharge "Microsoft Authenticator" ou "Google Authenticator"
   - Si Android : pareil, va sur le Play Store
8. Dans l'app, **scanne le QR code**
9. L'app affiche un code a 6 chiffres qui change toutes les 30 secondes
10. Reviens sur GitHub, entre le code
11. **IMPORTANT** : GitHub te montre des **recovery codes**. Copie-les dans un fichier texte sur ton PC et garde-le precieusement (si tu perds ton telephone, c'est la seule facon de recuperer ton compte)
12. Clique **Enable**

✅ **2FA activee !**

---

## PARTIE 2 : Creer un "Personal Access Token" (3 min)

> GitHub n'accepte plus les mots de passe depuis 2021. Tu dois creer un token.

### Etape 2.1 : Aller sur la page des tokens

1. Connecte-toi sur https://github.com
2. Clique sur **ton avatar** en haut a droite
3. Menu → **Settings**
4. Menu gauche, tout en bas → **Developer settings**
5. Menu gauche → **Personal access tokens**
6. Menu deroulant → **Tokens (classic)**

### Etape 2.2 : Generer un nouveau token

1. Clique sur le bouton **Generate new token** (a droite)
2. Menu deroulant → **Generate new token (classic)**
3. GitHub va peut-etre te demander ton mot de passe + code 2FA

### Etape 2.3 : Configurer le token

Remplis le formulaire :

| Champ | Valeur |
|-------|--------|
| **Note** | `ShopMax Deploy` (juste pour t'en souvenir) |
| **Expiration** | Choisis `90 days` (ou `No expiration` si tu preferes) |
| **Scopes** | **Coche UNIQUEMENT** la case `repo` (tout en haut) |

### Etape 2.4 : Generer et COPIER

1. Clique **Generate token** (en bas)
2. GitHub affiche ton token (une longue chaine de caracteres)
3. **COPIE-LE IMMEDIATEMENT** (Ctrl+C)
4. Colle-le dans un fichier texte sur ton bureau nomme `github-token.txt`
5. **ATTENTION** : si tu fermes la page, tu ne pourras plus le voir !

> Ton token ressemble a : `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890`

✅ **Token cree et sauvegarde !**

---

## PARTIE 3 : Pousser ton code sur GitHub (10 min)

### Etape 3.1 : Verifier que Git est installe

1. Ouvre un terminal :
   - **Windows** : appuie sur `Win + R`, tape `cmd`, appuie Entree
   - Ou cherche "PowerShell" dans le menu Demarrer
2. Tape :
   ```
   git --version
   ```
3. Tu dois voir un truc comme `git version 2.42.0`. Si c'est le cas, Git est installe.
4. Si tu vois "command not found" :
   - Va sur https://git-scm.com/download/win
   - Telecharge et installe (Next, Next, Next...)

### Etape 3.2 : Configurer Git (une seule fois)

Dans le terminal, tape ces commandes (remplace par tes infos) :

```bash
git config --global user.name "Ismaila Bouba"
git config --global user.email "ton.email@gmail.com"
```

> Utilise le MEME email que pour ton compte GitHub.

### Etape 3.3 : Creer le repository sur GitHub

1. Va sur https://github.com
2. En haut a droite, clique sur le **+** (a cote de ton avatar)
3. Menu deroulant → **New repository**
4. Remplis :
   - **Repository name** : `shopmax` (ou `shopmax-ecommerce`)
   - **Description** : `Full-stack e-commerce platform for Cameroon - Next.js 15 + ASP.NET Core 10 + Flutter`
   - **Visibilite** : Selectionne **Public** (important pour portfolio)
   - **NE COCHE RIEN D'AUTRE** (pas de README, pas de .gitignore, pas de licence)
5. Clique **Create repository** (bouton vert en bas)

GitHub t'affiche une page avec des instructions. **Garde cette page ouverte**, tu vas avoir besoin de l'URL du repo.

L'URL ressemble a : `https://github.com/ismaila-bouba/shopmax.git`

### Etape 3.4 : Ouvrir le terminal dans le dossier du projet

1. Ouvre l'Explorateur Windows
2. Va dans le dossier ou tu as extrait `shopmax.zip`
3. Dans la barre d'adresse en haut, tape `cmd` et appuie **Entree**
4. Un terminal s'ouvre directement dans le bon dossier

Tu dois voir un truc comme : `C:\Users\TonNom\Desktop\shopmax>`

### Etape 3.5 : Initialiser le repo Git

Dans le terminal, tape ces commandes **une par une** (appuie Entree apres chaque) :

```bash
git init
```
> Cree un repo Git local. Tu vois "Initialized empty Git repository in..."

```bash
git add .
```
> Ajoute tous les fichiers. Attention au point a la fin.

```bash
git commit -m "Initial commit - ShopMax e-commerce platform"
```
> Cree le premier commit. Tu vois une liste de fichiers.

```bash
git branch -M main
```
> Renomme la branche en "main" (convention moderne).

```bash
git remote add origin https://github.com/TON_USER/shopmax.git
```
> **REMPLACE `TON_USER`** par ton vrai nom d'utilisateur et `shopmax` par le nom de ton repo.

### Etape 3.6 : Premier push

```bash
git push -u origin main
```

> **IMPORTANT** : Au moment ou on te demande le mot de passe, **colle ton Personal Access Token** (et NON ton mot de passe GitHub).

Exemple de ce que tu vas voir :
```
Username for 'https://github.com': ismaila-bouba
Password for 'https://github.com': [COLLE TON TOKEN ICI]
```

Si tout va bien, tu vois plein de lignes avec "Writing objects: 100%" puis "Branch 'main' set up to track remote branch 'main'".

### Etape 3.7 : Verifier

1. Va sur `https://github.com/TON_USER/shopmax` dans ton navigateur
2. Tu dois voir tous tes fichiers
3. Verifie que tu vois le README.md, le dossier `frontend/`, `backend/`, etc.
4. **Verifie** que tu ne vois PAS `.env`, `node_modules/`, `bin/`, `obj/` (ces fichiers sont bloques par le .gitignore)

✅ **Ton code est sur GitHub !**

---

## PARTIE 4 : Deployer sur Vercel (5 min)

### Etape 4.1 : Creer un compte Vercel

1. Va sur https://vercel.com
2. En haut a droite, clique **Sign Up**
3. Choisis **Continue with GitHub**
4. Une fenetre GitHub s'ouvre pour autoriser Vercel
5. Clique **Authorize Vercel**
6. Vercel te demande si tu es "Hobby" ou "Pro" → Choisis **Hobby** (gratuit)

✅ **Compte Vercel cree !**

### Etape 4.2 : Importer ton projet

1. Sur la page Vercel, tu vois "Let's build something new"
2. En dessous, tu vois "Import Git Repository"
3. Cherche `shopmax` dans la liste de tes repos
4. Tu le vois ? Clique sur **Import** a droite

> Si tu ne le vois pas :
> - Clique **Configure GitHub App**
> - Coche **All repositories** OU juste `shopmax`
> - Clique **Install & Authorize**
> - Reviens sur Vercel

### Etape 4.3 : Configurer le projet

Tu vois une page "Configure Project". Remplis :

| Champ | Valeur |
|-------|--------|
| **Project Name** | `shopmax` (ou autre, ca sera l'URL) |
| **Framework Preset** | Doit afficher `Next.js` automatiquement |
| **Root Directory** | Clique **Edit** → Tape `frontend` → Clique **Continue** |
| **Build and Output Settings** | Laisse par defaut (Next.js detecte tout) |

### Etape 4.4 : Variables d'environnement (optionnel)

1. Ouvre la section **Environment Variables** (en bas)
2. Ajoute les memes variables que dans ton `.env.local` du frontend :
   - `NEXT_PUBLIC_API_URL` = `http://localhost:5000/api` (ou l'URL de ton backend deploye)
3. Tu peux skip cette etape pour l'instant, le site marchera quand meme (avec un fallback mock)

### Etape 4.5 : Deployer !

1. Clique sur le gros bouton bleu **Deploy**
2. Vercel compile le projet (ca prend 1-3 min)
3. Tu vois des logs qui defilent
4. A la fin, tu vois "🎉 Congratulations!" avec des confettis
5. Vercel te donne une URL du type : `https://shopmax.vercel.app`

### Etape 4.6 : Tester ton site

1. Clique sur l'URL donnee par Vercel
2. Ton site s'ouvre dans un nouvel onglet !
3. Teste :
   - La page d'accueil
   - La navigation
   - Le mode sombre (icone lune/soleil)
   - Le menu mobile (reduis la fenetre)
   - L'installation PWA (barre d'adresse → icone "Installer")

✅ **Ton site est en ligne !**

---

## PARTIE 5 : Mises a jour futures (2 min a chaque fois)

### Methode A : Via le script .bat (recommande)

Double-clic sur `publish-github.bat` → c'est envoye sur GitHub.

Ensuite, **Vercel redéploie AUTOMATIQUEMENT** ! Pas besoin de toucher a Vercel.

### Methode B : Manuellement

```bash
# Dans le terminal, dans le dossier shopmax/
git add .
git commit -m "Description de ce que tu as change"
git push
```

> Vercel detecte le push et redeploie en 1-2 min.

---

## PARTIE 6 : Avoir un domaine custom (optionnel, 5 min + ~10€/an)

Au lieu de `shopmax.vercel.app`, tu peux avoir `shopmax.com`.

### Option 1 : Domaine gratuit
- `example.vercel.app` - deja ce qu'on a
- Pas de domaine gratuit (.com, .fr, etc. coutent ~10€/an)

### Option 2 : Acheter un domaine (10-15€/an)

Domaines pas chers :
- **Namecheap** : https://namecheap.com
- **OVH** : https://ovh.com (francais, bon pour le Cameroun)
- **Google Domains** : https://domains.google
- **Hostinger** : https://hostinger.com (Cameroun-friendly)

Acheter un `.com` ou `.cm` (Cameroun !) :
- `shopmax.com` - international
- `shopmax.cm` - local camerounais (cool !)

### Configurer sur Vercel

1. Achete le domaine
2. Sur Vercel → ton projet → **Settings** → **Domains**
3. Tape ton domaine → **Add**
4. Vercel te donne des serveurs DNS (du type `ns1.vercel-dns.com`)
5. Va sur le site ou tu as achete le domaine
6. Configure les DNS pour qu'ils pointent vers Vercel
7. Attends 24-48h (propagation DNS)
8. HTTPS s'active automatiquement (gratuit)

---

## RESUME

| Etape | Temps | Ce que tu obtiens |
|-------|-------|-------------------|
| 1. Compte GitHub | 5 min | Un compte sur GitHub |
| 2. Personal Access Token | 3 min | Un token pour pousser le code |
| 3. Push du code | 10 min | Ton code est en ligne sur GitHub |
| 4. Vercel + deploy | 5 min | Ton site web est accessible publiquement |
| 5. Domaine custom (optionnel) | 5 min + 10€ | Une URL personnalisee (shopmax.com) |

**Total : 20-30 minutes** et tu as un portfolio deploye en ligne ! 🎉

---

## Questions frequentes

### "J'ai perdu mon token, comment faire ?"
- Va sur https://github.com/settings/tokens
- Supprime l'ancien
- Cree-en un nouveau
- Sauvegarde-le dans un fichier

### "Vercel me demande de l'argent ?"
- Non, le plan Hobby est gratuit
- Limite : 100 GB de bande passante / mois (suffisant largement pour un portfolio)

### "Mon site affiche 'API Error', c'est grave ?"
- Non, c'est normal : le backend n'est pas deploye
- Soit tu deployes aussi le backend (Railway, voir guide)
- Soit tu actives le mode "demo/mock" du frontend (deja fait dans le code)

### "Comment voir les analytics (visiteurs) ?"
- Vercel → ton projet → onglet **Analytics** (gratuit)
- Tu vois le nombre de visiteurs, les pages vues, etc.

### "C'est quoi la difference entre Vercel et Netlify ?"
- Vercel est cree par l'equipe Next.js (support natif)
- Netlify est plus ancien, marche bien aussi
- Pour ton projet, Vercel est le meilleur choix
