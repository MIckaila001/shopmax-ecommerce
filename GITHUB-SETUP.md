# Guide GitHub - Comment poster ton projet

## Reponses a tes questions

### Faut-il laisser le code visible ?

**OUI, 1000 fois OUI !** Pour un portfolio developpeur :
- Les recruteurs **DOIVENT** pouvoir voir ton code
- GitHub = vitrine professionnelle moderne
- Le code public montre tes competences (architecture, qualite, conventions)
- Possibilite d'avoir des etoiles/forks = preuve sociale
- **GitHub Pages** heberge ton site gratuitement (en bonus !)

### Faut-il proteger des secrets ?

**OUI**, certains fichiers DOIVENT rester prives via `.gitignore` :
- Tes mots de passe de BDD
- Tes cles API (Google, Resend, NotchPay)
- Ton JWT secret
- Tes identifiants personnels

Mais **le code source** lui-meme doit etre public.

## Methode simple avec les scripts .bat (recommande)

### Etape 1 : Creer un compte GitHub

1. Va sur https://github.com
2. Clique sur "Sign up"
3. Choisis un nom de profil **professionnel** (ex: `ismaila-bouba`)
4. Active l'authentification 2 facteurs (2FA)

### Etape 2 : Creer un repository VIDE sur GitHub

1. Connecte-toi sur https://github.com
2. Clique sur le **+** en haut a droite > **New repository**
3. Remplis :
   - **Repository name** : `shopmax` (ou autre)
   - **Description** : `Full-stack e-commerce platform for Cameroon`
   - **Visibilite** : `Public` (important pour le portfolio)
   - **NE PAS** cocher "Add a README file"
   - **NE PAS** cocher ".gitignore"
   - **NE PAS** cocher "license"
4. Clique sur **Create repository**

GitHub t'affiche une URL du type :
```
https://github.com/TON_USER/shopmax.git
```
**COPIE CETTE URL** (tu en auras besoin).

### Etape 3 : Installer Git (si pas deja fait)

- Windows : telecharge https://git-scm.com/download/win
- Lors de l'installation, garde les options par defaut

### Etape 4 : Utiliser les scripts .bat

**C'est la que ca devient magique.** Tu as 2 scripts :

#### Script A : `setup-github.bat` (une seule fois)

Double-clic dessus. Il va te demander :
- Ton nom d'utilisateur GitHub
- L'URL du repo
- Ton nom (pour les commits)
- Ton email

Il sauvegarde tout dans `.git-config.bat` (cache, pas dans le repo).

#### Script B : `publish-github.bat` (a chaque fois)

Double-clic dessus. Il :
- Charge ta config sauvegardee
- Te montre ce qui va etre envoye
- Te demande un message de commit
- Push sur GitHub automatiquement

**C'est tout !** Pas besoin de taper des commandes Git a la main.

## Methode manuelle (si tu preferes le terminal)

### 1. Configurer Git
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton.email@example.com"
```

### 2. Initialiser le projet
```bash
cd shopmax
git init
git add .
git commit -m "Initial commit - ShopMax e-commerce platform"
git branch -M main
```

### 3. Connecter a GitHub
```bash
# REMPLACE TON_USER par ton nom d'utilisateur
git remote add origin https://github.com/TON_USER/shopmax.git
```

### 4. Premier push
```bash
git push -u origin main
```

### 5. Mises a jour suivantes
```bash
git add .
git commit -m "Description des changements"
git push
```

## Authentification GitHub (IMPORTANT)

Depuis 2021, GitHub n'accepte plus les mots de passe pour `git push`. Tu dois creer un **Personal Access Token (PAT)**.

### Creer un token

1. Va sur https://github.com/settings/tokens
2. **Generate new token** > **Classic**
3. Nom : `ShopMax Deploy`
4. Expiration : `90 days`
5. Coche UNIQUEMENT `repo`
6. Clique **Generate token**
7. **COPIE LE TOKEN** immediatement (tu ne le reverras plus !)

### Utiliser le token

Quand Git te demande le mot de passe, colle le token au lieu de ton mot de passe.

### Alternative : GitHub CLI (plus simple)

1. Installe https://cli.github.com
2. `gh auth login`
3. Plus jamais besoin de token !

## Heberger le site gratuitement

### Vercel (recommande pour Next.js)

1. Va sur https://vercel.com
2. **Sign in with GitHub**
3. **New Project** > Importe `shopmax`
4. Configure :
   - **Framework Preset** : Next.js
   - **Root Directory** : `frontend`
5. **Environment Variables** : copie celles de `.env.local`
6. **Deploy** !

Tu auras une URL : `https://shopmax.vercel.app`

### Railway (pour le backend .NET)

1. Va sur https://railway.app
2. **Sign in with GitHub**
3. **New Project** > **Deploy from GitHub repo**
4. Selectionne `shopmax`
5. Ajoute PostgreSQL et Redis comme services
6. Configure les variables d'environnement
7. Deploy !

## Promouvoir ton projet

Une fois en ligne, partage sur :

- **LinkedIn** : avec captures d'ecran et lien du repo
- **Twitter/X** : #NextJS #ASPNET #Flutter #100DaysOfCode
- **Dev.to** : ecris un article "How I built ShopMax"
- **Reddit** : r/webdev, r/nextjs, r/dotnet

## Checklist finale

- [ ] `.env.example` present (PAS de `.env`)
- [ ] `appsettings.example.json` present (PAS de `appsettings.Development.json`)
- [ ] `node_modules/`, `bin/`, `obj/`, `.next/` ignores
- [ ] README complet avec screenshots
- [ ] LICENSE (MIT) ajoute
- [ ] Code propre (pas de console.log, pas de TODO laisses)
- [ ] Premiere publication testee localement

## Resume

| Quoi | Comment |
|------|---------|
| **Methode recommandee** | Double-clic sur `setup-github.bat` puis `publish-github.bat` |
| Code public ? | **OUI** (c'est un portfolio) |
| Secrets a proteger ? | **OUI** (via `.gitignore` et `.env.example`) |
| Ou heberger ? | **Vercel** (frontend) + **Railway** (backend) |
| Licence recommandee ? | **MIT** (la plus permissive) |
| Comment se faire remarquer ? | **README soignee** + **LinkedIn** + **Dev.to** |

**TL;DR** :
1. Cree un repo vide sur github.com
2. Double-clic sur `setup-github.bat` (une fois)
3. Double-clic sur `publish-github.bat` (a chaque update)

Bon courage !
