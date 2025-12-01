# 🚀 Démarrage Rapide - 5 minutes

## Option 1 : Test local rapide

```bash
cd restaurant-notes
npm install
npm run dev
```

Ouvrez http://localhost:3000

**Note** : En local, les données ne persistent pas entre les redémarrages (c'est normal).

## Option 2 : Déploiement sur Vercel (RECOMMANDÉ)

### 1️⃣ GitHub (2 min)

```bash
cd restaurant-notes
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/restaurant-notes.git
git push -u origin main
```

### 2️⃣ Vercel (3 min)

1. Allez sur https://vercel.com
2. Cliquez "Add New..." → "Project"
3. Importez `restaurant-notes`
4. Allez dans "Storage" → "Create Database" → "KV" → Créez `restaurant-db`
5. Connectez KV au projet
6. Déployez !

**C'est tout !** Votre app est en ligne avec une base de données ! 🎉

## 🔗 URL de l'app

Vous recevrez une URL type : `https://restaurant-notes-xxx.vercel.app`

Partagez cette URL avec vos employés - ils verront tous les mêmes données !

## 🆘 Besoin d'aide ?

Voir les guides complets :
- `README.md` - Documentation complète
- `DEPLOIEMENT.md` - Guide détaillé de déploiement

## ✅ Vérifier que tout fonctionne

Visitez : `https://votre-app.vercel.app/api/health`

Vous devriez voir : "Vercel KV est configuré et fonctionne correctement ! ✅"

## 🔄 Mettre à jour l'app

```bash
git add .
git commit -m "Mes changements"
git push
```

Vercel redéploie automatiquement ! 🚀
