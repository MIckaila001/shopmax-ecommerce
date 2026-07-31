# Configurer Vercel pour Railway - Pas a pas

## Pourquoi

Ton backend Railway est en ligne (teste : `https://shopmax-ecommerce-production.up.railway.app/health`).
Ton frontend Vercel est en ligne.
On va les connecter !

## Etape 1 : Aller sur Vercel

1. Va sur https://vercel.com/dashboard
2. Connecte-toi (meme compte GitHub)
3. Clique sur ton projet `shopmax-ecommerce`
4. En haut, clique sur **"Settings"**
5. Dans le menu gauche, clique sur **"Environment Variables"**

## Etape 2 : Ajouter la variable

1. Section **"Environment Variables"**
2. Tu vois un champ de saisie
3. Remplis :
   - **Name** : `NEXT_PUBLIC_API_URL`
   - **Value** : `https://shopmax-ecommerce-production.up.railway.app/api`
4. **IMPORTANT** : Coche les 3 cases :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Clique **"Save"**

## Etape 3 : Redeploy

1. En haut, clique sur **"Deployments"**
2. Sur le **dernier deploiement**, clique les **3 points "..."**
3. Clique **"Redeploy"**
4. Confirme
5. Attends 2-3 min

## Etape 4 : Verifier

1. Va sur `https://shopmax-ecommerce.vercel.app`
2. Ouvre la console du navigateur (F12)
3. Tu devrais voir des appels a `https://shopmax-ecommerce-production.up.railway.app/api/...` dans l'onglet **Network**
4. Si tu vois du JSON, c'est bon !

## Alternative : via vercel.json

Si tu preferes configurer via fichier, cree un fichier `vercel.json` a la **racine** du repo (PAS dans frontend/) :

```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://shopmax-ecommerce-production.up.railway.app/api"
  }
}
```

**ATTENTION** : Si tu fais ca, ne mets PAS de `buildCommand` ou `installCommand` dedans, sinon ca va casser (comme la derniere fois).

## Tester

Une fois redeploye, va sur `/boutique` et tu devrais voir des appels a l'API dans l'onglet Network du navigateur.

Si tu vois `/api/products` qui retourne du JSON, c'est que le frontend appelle bien le backend Railway.

## Verifier que ca marche cote backend

Va sur `https://shopmax-ecommerce-production.up.railway.app/swagger`

Tu dois voir la liste de tous les endpoints :
- /api/products
- /api/categories
- /api/promotions/active
- etc.

## Verifier que le CORS marche

Si tu as des erreurs CORS dans la console du navigateur, c'est que la variable `ALLOWED_ORIGINS` sur Railway n'est pas bonne.

Va sur Railway > service backend > Variables > `ALLOWED_ORIGINS`
Doit etre : `https://shopmax-ecommerce.vercel.app` (ton URL Vercel EXACTE)

## Frontend intelligent

Le frontend a un **fallback automatique** sur les mocks si l'API ne repond pas. Donc meme si l'API est down, le site continue de fonctionner avec les produits en dur.

Donc ne t'inquiete pas si tu vois des erreurs 404 sur certains endpoints, le site marchera quand meme !
