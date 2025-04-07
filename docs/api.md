# Documentation API Spotifake

## Table des matières
- [Introduction](#introduction)
- [Authentification](#authentification)
- [Endpoints](#endpoints)
  - [Utilisateurs](#utilisateurs)
  - [Musiques](#musiques)
  - [Playlists](#playlists)
  - [Albums](#albums)
  - [Artistes](#artistes)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Limites d'utilisation](#limites-dutilisation)

## Introduction

L'API Spotifake est une API RESTful qui permet d'interagir avec le service de streaming musical. Elle utilise JSON pour les requêtes et les réponses, et implémente une authentification JWT.

Base URL : `https://api.spotifake.com/v1`

## Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification. Pour obtenir un token :

### POST /auth/login
```json
{
    "email": "user@example.com",
    "password": "votre_mot_de_passe"
}
```

Réponse :
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "123",
        "email": "user@example.com",
        "name": "John Doe"
    }
}
```

Utilisez le token dans l'en-tête Authorization de vos requêtes :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Endpoints

### Utilisateurs

#### GET /users/me
Récupère les informations de l'utilisateur connecté.

Réponse :
```json
{
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "createdAt": "2024-04-07T12:00:00Z",
    "premium": false
}
```

#### PUT /users/me
Met à jour les informations de l'utilisateur.

Requête :
```json
{
    "name": "John Smith",
    "email": "john.smith@example.com"
}
```

### Musiques

#### GET /songs
Récupère la liste des musiques disponibles.

Paramètres de requête :
- `page` (optionnel) : Numéro de la page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 20)
- `search` (optionnel) : Terme de recherche
- `genre` (optionnel) : Filtrer par genre

Réponse :
```json
{
    "songs": [
        {
            "id": "song_123",
            "title": "Titre de la chanson",
            "artist": {
                "id": "artist_123",
                "name": "Nom de l'artiste"
            },
            "album": {
                "id": "album_123",
                "name": "Nom de l'album",
                "coverUrl": "https://..."
            },
            "duration": 180,
            "genre": "Pop"
        }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
}
```

#### GET /songs/{id}
Récupère les détails d'une chanson spécifique.

### Playlists

#### POST /playlists
Crée une nouvelle playlist.

Requête :
```json
{
    "name": "Ma Playlist",
    "description": "Description de ma playlist",
    "isPublic": true
}
```

#### GET /playlists/{id}
Récupère les détails d'une playlist.

#### PUT /playlists/{id}
Modifie une playlist existante.

#### DELETE /playlists/{id}
Supprime une playlist.

#### POST /playlists/{id}/songs
Ajoute une chanson à la playlist.

Requête :
```json
{
    "songId": "song_123"
}
```

### Albums

#### GET /albums
Récupère la liste des albums.

Paramètres de requête similaires à /songs.

#### GET /albums/{id}
Récupère les détails d'un album spécifique.

### Artistes

#### GET /artists
Récupère la liste des artistes.

#### GET /artists/{id}
Récupère les détails d'un artiste.

#### GET /artists/{id}/albums
Récupère les albums d'un artiste.

## Gestion des erreurs

L'API utilise les codes de statut HTTP standards et renvoie des erreurs au format suivant :

```json
{
    "error": {
        "code": "INVALID_CREDENTIALS",
        "message": "Email ou mot de passe incorrect",
        "status": 401
    }
}
```

Codes d'erreur communs :
- 400 Bad Request : Requête invalide
- 401 Unauthorized : Non authentifié
- 403 Forbidden : Non autorisé
- 404 Not Found : Ressource non trouvée
- 429 Too Many Requests : Limite de requêtes dépassée
- 500 Internal Server Error : Erreur serveur

## Limites d'utilisation

- Rate limit : 1000 requêtes par heure par utilisateur
- Taille maximale des fichiers : 10MB
- Nombre maximum de playlists par utilisateur : 100
- Nombre maximum de chansons par playlist : 1000 