# 🚀 Guide de déploiement sur Vercel

## Prérequis

- Un compte GitHub
- Un compte Vercel (gratuit)
- Le code poussé sur GitHub

## 📦 Étape 1 : Pousser le code sur GitHub

```bash
# Dans le dossier restaurant-notes

# Initialiser Git
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Restaurant notes app with Vercel KV"

# Renommer la branche en main
git branch -M main

# Ajouter le remote (REMPLACEZ l'URL par la vôtre)
git remote add origin https://github.com/VOTRE-USERNAME/restaurant-notes.git

# Pousser sur GitHub
git push -u origin main
```

## 🌐 Étape 2 : Déployer sur Vercel

### Via l'interface web (Recommandé)

1. Allez sur https://vercel.com
2. Cliquez sur "Add New..." → "Project"
3. Importez votre repo `restaurant-notes`
4. Vercel détectera automatiquement Next.js
5. **NE DÉPLOYEZ PAS ENCORE** - Cliquez sur "Environment Variables" d'abord

### ⚡ Étape 3 : Créer la base de données Vercel KV

**IMPORTANT : Faites ceci AVANT le premier déploiement**

1. Dans votre projet Vercel, allez dans l'onglet **"Storage"**
2. Cliquez sur **"Create Database"**
3. Sélectionnez **"KV (Redis)"**
4. Donnez un nom : `restaurant-db`
5. Sélectionnez la région la plus proche de vos utilisateurs
6. Cliquez sur **"Create"**

### 🔗 Étape 4 : Connecter KV au projet

1. Dans la page de votre base KV, allez dans l'onglet **".env.local"**
2. Cliquez sur **"Connect Project"**
3. Sélectionnez votre projet `restaurant-notes`
4. Cliquez sur **"Connect"**

Les variables d'environnement sont maintenant automatiquement configurées ! ✨

### 🚀 Étape 5 : Déployer

1. Retournez à l'onglet **"Deployments"**
2. Cliquez sur **"Deploy"**
3. Attendez quelques minutes
4. Votre app est en ligne ! 🎉

## 🔄 Mettre à jour l'application

Après avoir fait des modifications :

```bash
git add .
git commit -m "Description des changements"
git push
```

Vercel redéploiera automatiquement ! 🚀

## 📊 Vérifier les données

Pour vérifier que les données sont bien stockées :

1. Allez dans l'onglet **"Storage"** de votre projet Vercel
2. Cliquez sur votre base KV
3. Allez dans l'onglet **"Data"**
4. Vous verrez vos clés :
   - `restaurant:menu` - Le menu
   - `restaurant:notes` - Les notes

## 🆓 Limites du plan gratuit

- **256 MB** de stockage
- **100,000** commandes/mois
- Largement suffisant pour un restaurant !

## ⚙️ Variables d'environnement (automatiques)

Ces variables sont créées automatiquement par Vercel :
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`
- `KV_URL`

## 🔧 Développement local

Pour développer localement avec KV :

1. Installez Vercel CLI : `npm i -g vercel`
2. Connectez-vous : `vercel login`
3. Liez le projet : `vercel link`
4. Récupérez les variables : `vercel env pull .env.local`
5. Lancez le serveur : `npm run dev`

## 🆘 Dépannage

### Erreur "KV is not configured"
→ Vérifiez que vous avez bien créé et connecté la base KV

### Les données ne persistent pas
→ Vérifiez que les variables d'environnement KV sont bien configurées dans Vercel

### Erreur au déploiement
→ Vérifiez que `@vercel/kv` est bien dans package.json

## 📱 Accès multi-appareils

Une fois déployé sur Vercel, tous vos appareils (téléphones, tablettes, ordinateurs) peuvent accéder à l'application via l'URL Vercel :

`https://grabuge-note.vercel.app`

Tous les appareils verront les mêmes données en temps réel ! 🎉
