# Railway - Hebergement et couts

## Reponse rapide

**OUI**, Railway heberge une **vraie base de donnees PostgreSQL** gratuitement, mais avec des **limites**. Voici les details.

---

## Ce que tu as GRATUITEMENT

### Le service backend (API .NET)
- **500h d'execution par mois** (suffisant pour 1 backend toujours actif)
- **512 MB de RAM**
- **1 GB de stockage**
- **HTTPS automatique**
- **Auto-deploy depuis GitHub**
- **Domaine gratuit** : `*.up.railway.app`

### La base de donnees PostgreSQL
- **Oui, c'est inclus dans le plan gratuit**
- **512 MB de stockage**
- **PostgreSQL 15+** (version complete)
- **Toutes les fonctionnalites** : tables, index, foreign keys, etc.
- **Accessible** depuis ton backend Railway
- **Backups automatiques** (quotidiens)

### Limitations
- **Le service s'endort** apres 5 min d'inactivite (mais se reveille auto)
- **Pas de domaine custom** en gratuit (mais `*.up.railway.app` suffit pour un portfolio)
- **Limite de 5$/mois** de consommation totale (free trial = 5$ offert)

---

## Comparaison avec d'autres options

| Plateforme | Backend gratuit | BDD gratuite | Limitations |
|------------|----------------|--------------|-------------|
| **Railway** | ✅ 500h/mois | ✅ PostgreSQL 512MB | S'endort apres inactivite |
| **Render** | ✅ 750h/mois | ✅ PostgreSQL 90 jours | S'endort apres 15 min |
| **Fly.io** | ✅ 3 VMs gratuites | ❌ Pas de BDD incluse | Plus complexe |
| **Vercel** | ❌ Pas de backend .NET | ❌ Pas de BDD | Pour Next.js seulement |
| **Netlify** | ⚠️ Functions limitees | ❌ Pas de BDD | Pour sites statiques |
| **Supabase** | ❌ Pas de backend | ✅ PostgreSQL 500MB | Juste la BDD |
| **Neon** | ❌ Pas de backend | ✅ PostgreSQL 3GB | Juste la BDD |

---

## Pour ton projet portfolio

Railway est **parfait** car :
- ✅ Backend .NET gratuit
- ✅ PostgreSQL gratuit
- ✅ Tout est au meme endroit
- ✅ Facile a gerer
- ✅ Suffisant pour un portfolio

---

## Les vrais couts si tu depasses

### Plan "Hobby" (apres le trial gratuit)
- **5$/mois** de credit offert
- Puis tu paies **ce que tu consommes**
- Environ **5-10$/mois** pour un petit backend
- 1 base PostgreSQL : ~5$/mois

### Plan "Pro"
- **20$/mois** + consommation
- Pour les projets serieux

---

## Verdict

**Pour ton portfolio, Railway gratuit = largement suffisant.**

Quand tu auras un vrai projet commercial (pas avant longtemps 😅), tu pourras migrer vers un VPS ou passer au plan paye.

---

## Alternative : Neon + Render

Si tu veux **zero risque de facture** :
- **Neon.tech** : PostgreSQL gratuit jusqu'a 3GB, jamais s'endort
- **Render.com** : Backend .NET gratuit, s'endort apres 15 min d'inactivite
- Total : **0€/mois** garanti

C'est ce que recommandent beaucoup de devs pour portfolio.

Mais Railway est **plus simple** car tout est au meme endroit.

---

## Mon conseil pour toi

1. **Commence avec Railway** (le plus simple)
2. Surveille ta conso sur https://railway.app/account
3. Si tu vois que ca consomme, migre vers Neon + Render
4. Pour un portfolio, tu ne depasseras surement jamais les 5$ gratuits

**Resumé** : Oui, Railway heberge une **vraie PostgreSQL gratuite**. C'est un des meilleurs choix pour ton cas. 👍
