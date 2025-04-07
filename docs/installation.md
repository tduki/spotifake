# Guide d'Installation

Ce guide vous aidera à installer et configurer Spotifake sur votre machine locale.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- Node.js (v18.0.0 ou supérieur)
- npm (v8.0.0 ou supérieur)
- PostgreSQL (v14.0 ou supérieur)
- Git

## Installation

1. **Cloner le repository**

```bash
git clone https://github.com/votre-username/spotifake.git
cd spotifake
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configuration de l'environnement**

Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` avec vos paramètres :

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/spotifake"

# JWT
JWT_SECRET="votre_secret_jwt"
JWT_EXPIRATION="24h"

# API
PORT=3000
NODE_ENV=development

# Services externes (optionnels)
STRIPE_SECRET_KEY="votre_cle_stripe"
AWS_S3_BUCKET="nom_bucket"
AWS_ACCESS_KEY="votre_cle_aws"
AWS_SECRET_KEY="votre_secret_aws"
```

4. **Initialiser la base de données**

```bash
# Créer la base de données
npx prisma db push

# Charger les données de test (optionnel)
npm run seed
```

5. **Lancer l'application**

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

L'application sera disponible sur `http://localhost:3000`

## Configuration de la base de données

1. **Créer un utilisateur PostgreSQL**

```sql
CREATE USER spotifake WITH PASSWORD 'votre_mot_de_passe';
CREATE DATABASE spotifake;
GRANT ALL PRIVILEGES ON DATABASE spotifake TO spotifake;
```

2. **Structure de la base de données**

Le schéma de la base de données est géré par Prisma. Vous pouvez voir la structure dans `prisma/schema.prisma`.

## Configuration du stockage

Par défaut, les fichiers sont stockés localement. Pour utiliser AWS S3 :

1. Créez un bucket S3 sur AWS
2. Configurez les variables d'environnement AWS dans `.env`
3. Activez le stockage S3 dans `config/storage.js`

## Tests

```bash
# Exécuter tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration uniquement
npm run test:integration
```

## Déploiement

### Déploiement sur Vercel

1. Connectez-vous à Vercel
2. Importez votre projet depuis GitHub
3. Configurez les variables d'environnement
4. Déployez !

### Déploiement manuel

1. Construisez l'application :
```bash
npm run build
```

2. Démarrez le serveur :
```bash
NODE_ENV=production npm start
```

## Résolution des problèmes courants

### Erreur de connexion à la base de données

- Vérifiez que PostgreSQL est en cours d'exécution
- Vérifiez les informations de connexion dans `.env`
- Vérifiez les permissions de l'utilisateur PostgreSQL

### Erreur de build

- Nettoyez le cache : `npm clean-install`
- Supprimez le dossier `.next` : `rm -rf .next`
- Reconstruisez : `npm run build`

### Problèmes de performance

- Vérifiez la configuration de votre base de données
- Activez le cache Redis (optionnel)
- Optimisez les requêtes avec l'outil de monitoring

## Support

Si vous rencontrez des problèmes :

1. Consultez les [issues GitHub](https://github.com/votre-username/spotifake/issues)
2. Créez une nouvelle issue avec :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Logs d'erreur
   - Environnement (OS, versions) 