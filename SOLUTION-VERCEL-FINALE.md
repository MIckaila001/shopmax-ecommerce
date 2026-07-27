# Solution FINALE au 404 Vercel

## Le probleme

Deploiement reussi sur Vercel mais affichage de "404 NOT_FOUND" sur toutes les pages.

## La cause

Mauvaise configuration des **Build & Development Settings** dans Vercel.

Pour un projet Next.js dans un sous-dossier (`frontend/`), il faut specifier explicitement le bon dossier racine et les bonnes commandes de build.

## LA SOLUTION (qui marche)

Dans Vercel > ton projet > **Settings** > **General** > **Build & Development Settings** :

| Parametre | Valeur correcte |
|-----------|-----------------|
| **Root Directory** | `frontend` |
| **Build Command** | `next build` (ou laisser vide) |
| **Output Directory** | `.next` (ou laisser vide) |
| **Install Command** | `npm install` (ou laisser vide) |
| **Development Command** | `next dev` (ou laisser vide) |
| **Framework Preset** | Next.js |

### Ce qui ne marchait PAS (mon diagnostic initial) :
- Penser que le probleme venait du code
- Penser que c'etait un cache Vercel
- Penser qu'il fallait tout supprimer et recréer

### Ce qui a RESOLU le probleme :
Verifier / corriger les **Build & Development Settings** dans Vercel.

## Procedure complete pour deployer un Next.js depuis un sous-dossier

### 1. Structure du projet

```
shopmax/
├── frontend/        <-- contient le projet Next.js
│   ├── app/
│   ├── package.json
│   ├── next.config.js
│   └── ...
├── backend/
└── ...
```

### 2. Sur Vercel

1. Va sur https://vercel.com/dashboard
2. **Add New** > **Project**
3. Importe ton repo GitHub
4. **NE CLIQUE PAS ENCORE SUR DEPLOY**
5. Va dans **Settings** > **General** > **Build & Development Settings** :

| Parametre | Valeur |
|-----------|--------|
| **Root Directory** | `frontend` ⚠️ TRES IMPORTANT |
| **Build Command** | `next build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Framework Preset** | Next.js |

6. Sauvegarde
7. **Deploy**

### 3. Verifier

1. Attends 2-3 min
2. Tu dois voir "Congratulations!" avec confettis
3. L'URL generee fonctionne

## Cas particuliers

### Si Root Directory ne s'applique pas

Cree un fichier `vercel.json` a la racine du repo :

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

### Si tu as "Cannot find module" au build

Verifie que :
- `frontend/package.json` existe et contient toutes les deps
- `frontend/node_modules` est bien reinstalle apres un push

### Si tu as toujours 404 apres ces reglages

1. Verifie que `frontend/app/page.tsx` existe
2. Teste le build en local : `cd frontend && npm run build`
3. Si le build local reussit, c'est un probleme Vercel
4. Supprime le projet Vercel et recree-le

## Lecon apprise

Quand Vercel deploye un projet dans un sous-dossier, il faut TOUJOURS specifier :
- **Root Directory** : le sous-dossier
- **Build Command** : la commande complete incluant le `cd`

Sinon Vercel cherche `package.json` a la racine du repo, ne le trouve pas (ou trouve le mauvais), et deploye un projet vide qui renvoie 404.

## Alternative : deplacer le frontend a la racine

Si la configuration Vercel te pose probleme, tu peux deplacer `frontend/*` a la racine :

```bash
# Sur ton PC
cd shopmax
cp -r frontend/* .
cp -r frontend/.gitignore . 2>/dev/null
git add .
git commit -m "Move frontend to root"
git push
```

Puis sur Vercel, laisse **Root Directory vide** et ca marchera directement.

Mais c'est moins propre que de garder la structure monorepo.
