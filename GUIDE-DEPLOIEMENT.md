# Guide de deploiement - Comparaison des options

## Reponse rapide

**Utilise Vercel**, pas GitHub Pages. Voici pourquoi :

## Comparaison detaillee

| Critere | GitHub Pages | Vercel | Netlify | Railway |
|---------|--------------|--------|---------|---------|
| **Next.js 15 (App Router)** | ❌ Ne marche PAS bien | ✅ Parfait (cree par l'equipe Next.js) | ✅ Bon | ✅ Bon |
| **PWA / Service Worker** | ⚠️ Limite | ✅ Natif | ✅ Bon | ✅ Bon |
| **API routes** | ❌ Non | ✅ Oui | ✅ Oui | ✅ Oui |
| **HTTPS gratuit** | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui |
| **Domaine custom** | ✅ Gratuit | ✅ Gratuit | ✅ Gratuit | ⚠️ Payant |
| **Build auto depuis Git** | ⚠️ Limite | ✅ Oui | ✅ Oui | ✅ Oui |
| **Vitesse** | Lent | Ultra rapide (CDN mondial) | Rapide | Moyen |
| **Gratuit pour portfolio** | ✅ Oui | ✅ Oui (suffisant) | ✅ Oui | ⚠️ Limite |
| **Complexite setup** | Moyenne | Tres simple | Simple | Moyenne |
| **Recommande par Next.js** | Non | **OUI** | Non | Non |

## Pourquoi Vercel ?

1. **Cree par l'equipe Next.js** - support natif, pas de surprises
2. **Zero config** - il detecte automatiquement que c'est du Next.js
3. **CDN mondial** - site rapide partout dans le monde
4. **HTTPS automatique**
5. **URL gratuite** du type `shopmax.vercel.app`
6. **Domaine custom gratuit** : tu peux mettre `shopmax.com` si tu l'achetes

## Pourquoi PAS GitHub Pages ?

GitHub Pages est concu pour des **sites statiques** (HTML/CSS/JS pur).
Notre site est en Next.js 15 avec :
- App Router (Server Components)
- API routes
- Server-side rendering
- Image optimization
- etc.

GitHub Pages ne peut pas executer tout ca. Il faudrait :
- Build le site en statique (`next export`)
- Perdre toutes les fonctionnalites serveur
- Plus de problemes qu'autre chose

**Conclusion** : Vercel pour le frontend, Railway/Render pour le backend.

## Plan d'action recommande

### Phase 1 : Frontend (5 minutes)
1. Compte GitHub + push du code (cf. GITHUB-SETUP.md)
2. Compte Vercel via GitHub
3. Import du repo
4. Deploy
5. URL generee automatiquement

### Phase 2 : Backend (optionnel, 15 minutes)
- Railway.app ou Render.com pour heberger l'API ASP.NET
- PostgreSQL gratuit via Neon.tech ou Supabase
- Redis via Upstash (gratuit jusqu'a 10K requetes/jour)

### Phase 3 : Visuels pour portfolio
- Screenshots de chaque page
- GIF anime de la navigation
- Liens deployes dans le README

## Pour l'app Flutter

Les recruteurs ne peuvent pas installer une app facilement, mais tu peux :
- **APK signe** telechargeable (via Google Drive ou ton site)
- **Demo video** YouTube
- **QR code** dans le README pour telecharger
- **Captures d'ecran** dans le repo

## Resume en 1 phrase

> **Vercel pour le frontend Next.js** (gratuit, parfait, 5 min de setup)
> **GitHub Pages** : oublie, c'est pour les sites statiques simples.
