# PROTOCOLE FRESH START - Resolution 404 Vercel

## Diagnostic complet

Apres analyse, le projet est CORRECT. Le probleme vient de :
- Cache Vercel persistant
- Eventuellement un fichier cache (tsbuildinfo) sur le repo

## PROCEDURE EN 7 ETAPES (15 minutes)

### ETAPE 1 : Nettoyage local (2 min)

Ouvre un terminal dans le dossier `shopmax/` (pas dans frontend) :

```bash
cd frontend
del tsconfig.tsbuildinfo
rd /s /q node_modules
rd /s /q .next
cd ..
```

### ETAPE 2 : Reinstalle les dependances (3 min)

```bash
cd frontend
npm install
```

Attends que ca finisse (2-3 min, tu verras "added XXX packages").

### ETAPE 3 : Build local pour valider (3 min)

```bash
npm run build
```

**Si tu vois a la fin** :
```
Route (app)                                Size     First Load JS
+ First Load JS shared by all             XXX kB
```

... c'est bon, ton code est valide.

**Si tu vois une erreur ROUGE** : copie-la ici, on la corrige avant de continuer.

### ETAPE 4 : Force push avec fresh commit (1 min)

```bash
cd ..
git add .
git commit -m "Fresh build - clean cache"
git push
```

### ETAPE 5 : VERCEL - Supprime TOUT et recommence (3 min)

1. Va sur https://vercel.com/dashboard
2. Si tu as un projet "shopmax-ecommerce" :
   - Clique dessus
   - Settings > General > tout en bas "Delete Project"
   - Confirme
3. Retour au dashboard
4. Clique "Add New..." > "Project"
5. Cherche "MIckaila001/shopmax-ecommerce" dans la liste
6. Clique "Import"

### ETAPE 6 : Configuration CRITIQUE (2 min)

Sur l'ecran de config :

| Champ | Valeur EXACTE |
|-------|---------------|
| **Project Name** | `shopmax` |
| **Framework Preset** | `Next.js` (auto-detecte) |
| **Root Directory** | CLIQUE "Edit" > tape `frontend` > CONFIRME |
| **Build Command** | `next build` (laisser vide pour auto) |
| **Output Directory** | `.next` (laisser vide pour auto) |
| **Install Command** | `npm install` (laisser vide) |

**TRES IMPORTANT** : le Root Directory DOIT etre `frontend`, sinon Vercel cherche a la racine et ne trouve pas Next.js.

### ETAPE 7 : Deploy (2 min)

1. Clique le bouton bleu "Deploy"
2. Attends 2-3 min
3. Tu dois voir "Congratulations!" avec des confettis
4. Clique "Visit" ou va sur l'URL generee

## Si TOUJOURS 404 apres ca

Le probleme est dans un fichier specifique. On va faire un test minimal :

### Test de diagnostic ultime

Dans `frontend/app/`, cree un fichier `test/page.tsx` :

```tsx
export default function Test() {
  return <h1 style={{padding: 50, fontSize: 30}}>CA MARCHE !</h1>;
}
```

```bash
git add .
git commit -m "Test minimal page"
git push
```

Attends le redeploiement, puis essaie : `https://shopmax-ecommerce.vercel.app/test`

- **Si "CA MARCHE" s'affiche** : le probleme vient d'un fichier specifique du projet
- **Si encore 404** : le probleme est Vercel/systeme, pas le code

## VERIFICATION FINALE

Si tu vois la page d'accueil ShopMax, BRAVO ! Tu as reussi.

Tu peux maintenant :
- Partager l'URL sur ton CV
- L'ajouter dans le README GitHub
- Configurer un domaine custom (optionnel)

## EN CAS DE BLOCAGE

Envoie-moi :
1. La sortie de `npm run build` (s'il y a une erreur)
2. Une capture de la page Vercel apres deploy
3. Le contenu de l'onglet "Build Logs" (les 20 dernieres lignes)

Avec ca, je peux t'aider en 2 minutes.
