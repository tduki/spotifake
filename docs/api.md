# Documentation de l'API Spotifake

## Introduction
Cette documentation détaille les endpoints et fonctionnalités de l'API Spotifake.

## Authentification
Pour utiliser l'API, vous devez d'abord vous authentifier...

## Endpoints

### Musiques

#### GET /api/songs
Récupère la liste des musiques disponibles.

**Paramètres de requête :**
- `page` (optionnel) : Numéro de la page
- `limit` (optionnel) : Nombre d'éléments par page

**Réponse :**
```json
{
    "songs": [
        {
            "id": "string",
            "title": "string",
            "artist": "string",
            "duration": "number"
        }
    ],
    "total": "number"
}
```

### Playlists

#### POST /api/playlists
Crée une nouvelle playlist.

**Corps de la requête :**
```json
{
    "name": "string",
    "description": "string"
}
```

## Gestion des erreurs
L'API utilise les codes de statut HTTP standards... 