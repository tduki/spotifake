# SpotiFake API

SpotiFake est une API REST pour un service de streaming musical inspiré de Spotify, développée avec Node.js, Express et MongoDB.

## Fonctionnalités

- Authentification et autorisation avec JWT
- Gestion des utilisateurs, artistes, albums, chansons et playlists
- Système de recommandations basé sur l'historique d'écoute
- Documentation API avec Swagger
- Tests unitaires et d'intégration
- Interface utilisateur responsive avec un design moderne
- Serveur Express configuré pour servir à la fois l'API et l'interface frontend
- Gestion d'images et fichiers statiques pour les pochettes d'albums et photos d'artistes

## Technologies utilisées

- **Backend**: Node.js, Express
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JSON Web Tokens (JWT)
- **Documentation**: Swagger UI
- **Tests**: Jest et Supertest
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Sécurité**: Helmet pour les en-têtes HTTP

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votrenom/spotifake.git
cd spotifake

# Installer les dépendances
npm install

# Variables d'environnement
cp .env.example .env
# Modifier les variables dans .env selon votre configuration

# Initialiser la base de données avec des données de démonstration
npm run db:seed

# Démarrer le serveur
npm start
```

## Accès à l'application

- **API REST**: http://localhost:3002/
- **Documentation Swagger**: http://localhost:3002/api-docs
- **Interface frontend**: http://localhost:3002/app

## Lancement des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter uniquement les tests unitaires
npm run test:unit

# Exécuter uniquement les tests d'intégration
npm run test:integration
```

## Structure du projet

```
spotifake/
├── src/                    # Code source principal
│   ├── controllers/        # Contrôleurs de l'API
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes de l'API
│   ├── middleware/         # Middleware personnalisé
│   ├── utils/              # Fonctions utilitaires
│   └── swagger/            # Documentation Swagger
├── tests/                  # Tests
│   ├── unit/               # Tests unitaires
│   └── integration/        # Tests d'intégration
├── frontend/               # Interface utilisateur
│   ├── css/                # Styles CSS
│   ├── js/                 # JavaScript
│   └── index.html          # Page d'accueil
├── public/                 # Fichiers statiques publics
│   └── images/             # Images pour l'application (pochettes, artistes, etc.)
├── server.js               # Point d'entrée de l'application
├── initDb.js               # Script d'initialisation de la base de données
└── README.md               # Documentation
```

## Documentation API

La documentation de l'API est disponible à l'adresse `http://localhost:3002/api-docs` lorsque le serveur est en cours d'exécution.

## Routes principales

### Authentification

- `POST /auth/signup` : Inscription d'un utilisateur
- `POST /auth/login` : Connexion avec génération de token JWT
- `GET /auth/me` : Récupération du profil de l'utilisateur connecté

### Utilisateurs

- `GET /users` : Liste des utilisateurs (admin)
- `GET /users/:id` : Détails d'un utilisateur
- `PUT /users/:id` : Modification d'un utilisateur
- `DELETE /users/:id` : Suppression d'un utilisateur
- `GET /users/:id/history` : Historique d'écoute d'un utilisateur
- `POST /users/:id/history` : Ajouter une chanson à l'historique d'écoute
- `GET /users/:id/recommendations` : Recommandations personnalisées

### Artistes

- `GET /artists` : Liste des artistes
- `GET /artists/:id` : Détails d'un artiste
- `POST /artists` : Création d'un artiste (admin)
- `PUT /artists/:id` : Modification d'un artiste (admin)
- `DELETE /artists/:id` : Suppression d'un artiste (admin)

### Albums

- `GET /albums` : Liste des albums
- `GET /albums/:id` : Détails d'un album
- `POST /albums` : Création d'un album (admin)
- `PUT /albums/:id` : Modification d'un album (admin)
- `DELETE /albums/:id` : Suppression d'un album (admin)

### Chansons

- `GET /songs` : Liste des chansons
- `GET /songs/:id` : Détails d'une chanson
- `POST /songs` : Création d'une chanson (admin)
- `PUT /songs/:id` : Modification d'une chanson (admin)
- `DELETE /songs/:id` : Suppression d'une chanson (admin)

### Playlists

- `GET /playlists` : Liste des playlists
- `GET /playlists/:id` : Détails d'une playlist
- `POST /playlists` : Création d'une playlist
- `PUT /playlists/:id` : Modification d'une playlist
- `DELETE /playlists/:id` : Suppression d'une playlist
- `POST /playlists/:id/songs` : Ajout d'une chanson à une playlist
- `DELETE /playlists/:id/songs/:songId` : Suppression d'une chanson d'une playlist

### Frontend et Ressources Statiques

- `GET /app` : Interface utilisateur frontend
- `GET /public/images/{imageName}` : Accès aux images (pochettes d'albums, photos d'artistes, etc.)

## Fonctionnalités Optionnelles Implémentées

### 1. Documentation Swagger
La documentation complète de l'API est disponible via Swagger UI à l'adresse `/api-docs`. Elle inclut tous les endpoints, modèles, paramètres et exemples de réponses.

### 2. Tests Unitaires et d'Intégration
- Tests unitaires pour les contrôleurs d'authentification et d'artistes
- Tests d'intégration pour les principales routes de l'API
- Configuration Jest pour l'exécution des tests

### 3. Interface Frontend Responsive
Une interface utilisateur moderne en HTML/CSS/JS qui permet de:
- Parcourir les artistes, albums et playlists
- Afficher les vraies pochettes d'albums et photos d'artistes
- S'authentifier (connexion/inscription)
- Afficher des recommandations personnalisées
- Design responsive adapté pour les appareils mobiles et desktop

### 4. Système de Recommandations
Un système de recommandations qui:
- Analyse l'historique d'écoute de l'utilisateur
- Identifie les genres et artistes préférés
- Suggère de nouvelles chansons similaires aux goûts de l'utilisateur
- Utilise des algorithmes de popularité comme fallback

### 5. Serveur Express Multifonction
Le serveur Express est configuré pour:
- Servir l'API REST avec tous ses endpoints
- Servir la documentation Swagger
- Servir l'interface frontend
- Servir les fichiers statiques (images, CSS, JS)

## Dernières Actualisations

### Version 1.1.0
- Ajout du support pour servir l'interface frontend via `/app`
- Implémentation du dossier public pour les images statiques
- Correction des noms d'albums pour correspondre à l'artiste Daft Punk (Random Access Memories, Discovery, Homework)
- Amélioration de l'affichage des playlists avec des images par défaut
- Correction des bugs d'affichage des images dans l'interface
- Mise à jour de la documentation Swagger

## Licence

MIT 