# Restaurant Notes

Système de gestion de notes pour restaurant avec Next.js, TypeScript et Tailwind CSS.

## Fonctionnalités

✨ **Gestion des notes**
- Créer des notes avec un titre personnalisé
- Ajouter/retirer des articles du menu avec compteurs
- Ajuster le montant (ajouter ou retirer de l'argent)
- Clôturer et rouvrir les notes
- Filtrer par statut (toutes, ouvertes, clôturées)

🍽️ **Gestion du menu**
- Ajouter, modifier et supprimer des articles
- Catégoriser par type (boissons, entrées, plats, desserts)
- Modifier les prix en temps réel

🔒 **Authentification**
- Connexion requise pour gérer le menu
- Protection des fonctionnalités administratives

📱 **Design responsive**
- Optimisé pour mobile et tablette (prioritaire)
- Interface minimaliste avec thème indigo profond et jaune
- Typographie futuriste (Orbitron - style japonais/tech)

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Lancer le serveur de développement :
```bash
npm run dev
```

3. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Identifiants de connexion

**Nom d'utilisateur:** admin  
**Mot de passe:** admin123

## Technologies utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **React Context** - Gestion d'état
- **Vercel KV (Redis)** - Base de données pour la production
- **API Routes** - Backend

## Stockage des données

### 🚀 En production (Vercel)
Les données sont stockées dans **Vercel KV** (Redis), une base de données rapide et gratuite jusqu'à 256 MB.

**Avantages** :
- ✅ Données persistantes et sécurisées
- ✅ Tous les appareils voient les mêmes données en temps réel
- ✅ Rapide et fiable
- ✅ Gratuit jusqu'à 100,000 requêtes/mois
- ✅ Parfait pour un restaurant

### 💻 En développement local
L'application utilise les données par défaut du menu. Vous pouvez connecter Vercel KV localement en suivant les instructions dans `DEPLOIEMENT.md`.

## 🚀 Déploiement sur Vercel

Voir le guide complet : [DEPLOIEMENT.md](./DEPLOIEMENT.md)

Résumé rapide :
1. Pousser le code sur GitHub
2. Créer un projet sur Vercel
3. Créer une base Vercel KV
4. Connecter KV au projet
5. Déployer !

Tous les détails sont dans le fichier `DEPLOIEMENT.md`.

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx       # Layout principal
│   ├── page.tsx         # Page d'accueil
│   └── globals.css      # Styles globaux
├── components/
│   ├── LoginModal.tsx   # Modal de connexion
│   ├── MenuManager.tsx  # Gestion du menu
│   └── NoteEditor.tsx   # Éditeur de note
├── contexts/
│   ├── AuthContext.tsx  # Contexte d'authentification
│   └── AppContext.tsx   # Contexte de l'application
├── data/
│   └── menuItems.ts     # Données initiales du menu
└── types/
    └── index.ts         # Types TypeScript
```

## Utilisation

### Créer une nouvelle note
1. Cliquer sur "+ NOUVELLE NOTE"
2. Entrer un titre (ex: "Table 5")
3. Cliquer sur "CRÉER"

### Ajouter des articles
1. Ouvrir une note
2. Utiliser les boutons + et - à côté de chaque article
3. Le total se met à jour automatiquement

### Ajuster le montant
1. Dans une note ouverte, aller à la section "AJUSTEMENTS"
2. Entrer un montant (positif pour ajouter, négatif pour retirer)
3. Ajouter une raison
4. Cliquer sur "AJOUTER"

### Gérer le menu
1. Se connecter avec les identifiants admin
2. Cliquer sur "⚙️ GÉRER LE MENU"
3. Ajouter, modifier ou supprimer des articles

## Production

Pour créer une version de production :

```bash
npm run build
npm start
```

## Notes importantes

- **Production** : Les données sont stockées dans Vercel KV (Redis) - persistantes et partagées
- **Développement local** : Utilise les données par défaut (non persistantes)
- Pour connecter KV localement : Voir `DEPLOIEMENT.md`
- Tous les appareils connectés voient les mêmes données
- Le plan gratuit de Vercel KV est largement suffisant pour un restaurant
- Le système d'authentification est basique et doit être renforcé pour la production
- Les prix sont en euros (€)

## Personnalisation

### Couleurs
Les couleurs peuvent être modifiées dans `tailwind.config.ts` :
- `primary` : Couleur de fond principale (indigo profond)
- `accent` : Couleur d'accentuation (jaune)

### Typographie
La police peut être changée dans `src/app/layout.tsx` en important une autre police de Google Fonts.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.
