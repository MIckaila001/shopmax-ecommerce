# Checklist - Publier ShopMax

Imprime cette page et coche au fur et a mesure !

## Preparation
- [ ] Compte email Gmail/Outlook fonctionnel
- [ ] Navigateur web (Chrome recommande)
- [ ] Connexion internet stable
- [ ] Le fichier `shopmax.zip` extrait quelque part
- [ ] Telephone portable pour la 2FA

## Phase 1 : GitHub (15 min)

- [ ] Aller sur https://github.com
- [ ] Cliquer "Sign up"
- [ ] Remplir : email, mot de passe fort, username (PRO)
- [ ] Verifier l'email (code a 6 chiffres)
- [ ] Activer la 2FA dans Settings → Password and authentication
- [ ] Sauvegarder les recovery codes dans un fichier
- [ ] Creer un Personal Access Token dans Settings → Developer settings
- [ ] Cocher uniquement "repo"
- [ ] Copier le token dans `github-token.txt` sur le bureau

## Phase 2 : Repository (5 min)

- [ ] Cliquer le "+" en haut a droite
- [ ] "New repository"
- [ ] Nom : `shopmax`
- [ ] Description : copier celle proposee
- [ ] Visibilite : **Public**
- [ ] NE RIEN COCHER (pas de README, etc.)
- [ ] Cliquer "Create repository"
- [ ] COPIER l'URL : `https://github.com/USER/shopmax.git`

## Phase 3 : Push (10 min)

- [ ] Ouvrir le terminal dans le dossier `shopmax/`
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Initial commit"`
- [ ] `git branch -M main`
- [ ] `git remote add origin URL_COPIEE`
- [ ] `git push -u origin main`
- [ ] Au password : **coller le TOKEN** (pas le mot de passe)
- [ ] Verifier sur github.com/USER/shopmax que les fichiers sont la
- [ ] Verifier que .env, node_modules, bin, obj ne sont PAS visibles

## Phase 4 : Vercel (5 min)

- [ ] Aller sur https://vercel.com
- [ ] "Sign Up" → "Continue with GitHub"
- [ ] Autoriser Vercel
- [ ] "Import Git Repository" → chercher `shopmax`
- [ ] Si invisible : "Configure GitHub App" → installer
- [ ] "Import" le projet
- [ ] **Root Directory** : `frontend` (IMPORTANT)
- [ ] Framework detecte : Next.js (verifier)
- [ ] "Deploy" (bouton bleu)
- [ ] Attendre 1-3 min
- [ ] Voir "Congratulations!"
- [ ] Cliquer sur l'URL generee (shopmax.vercel.app)
- [ ] Tester le site

## Phase 5 : Finalisation (5 min)

- [ ] Ajouter l'URL Vercel dans le README
- [ ] Commit + push le changement
- [ ] Partager sur LinkedIn / Twitter
- [ ] Mettre a jour le CV

---

**Duree totale : 35 minutes** ⏱️

**Tu as fini quand :**
- ✅ Ton code est sur GitHub (visible publiquement)
- ✅ Ton site est accessible via une URL Vercel
- ✅ Les recruteurs peuvent voir ton projet en visuel
