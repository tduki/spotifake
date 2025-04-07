# Schéma de la Base de Données MongoDB pour SpotiFake

Ce document décrit la structure de la base de données MongoDB utilisée dans l'API SpotiFake, en présentant les différentes collections et leurs relations.

## Collections et Relations

L'application utilise cinq collections principales qui sont liées entre elles :

```
┌───────────┐       ┌───────────┐       ┌───────────┐
│           │       │           │       │           │
│   User    │◄──────┤  Playlist │◄──────┤   Song    │
│           │       │           │       │           │
└───────────┘       └───────────┘       └───────────┘
      ▲                                       ▲
      │                                       │
      │                                       │
      │              ┌───────────┐            │
      └──────────────┤  Artist   │────────────┘
                     │           │
                     └───────────┘
                           ▲
                           │
                           │
                     ┌───────────┐
                     │   Album   │
                     │           │
                     └───────────┘
```

## Détails des Collections

### Collection `User` (Utilisateur)

```javascript
{
  _id: ObjectId,
  username: String,        // Nom d'utilisateur (unique)
  email: String,           // Adresse email (unique)
  password: String,        // Mot de passe crypté
  role: String,            // 'user' ou 'admin'
  favoriteArtists: [       // Liste des artistes favoris
    {
      type: ObjectId,
      ref: 'Artist'
    }
  ],
  listeningHistory: [      // Historique d'écoute
    {
      song: {
        type: ObjectId,
        ref: 'Song'
      },
      listenedAt: Date     // Date d'écoute
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `Artist` (Artiste)

```javascript
{
  _id: ObjectId,
  name: String,            // Nom de l'artiste (unique)
  bio: String,             // Biographie
  genres: [String],        // Genres musicaux
  image: String,           // URL de l'image
  popularity: Number,      // Indice de popularité (0-100)
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `Album`

```javascript
{
  _id: ObjectId,
  title: String,           // Titre de l'album
  artist: {                // Référence à l'artiste
    type: ObjectId,
    ref: 'Artist'
  },
  releaseDate: Date,       // Date de sortie
  coverImage: String,      // URL de la pochette
  genres: [String],        // Genres musicaux
  description: String,     // Description
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `Song` (Chanson)

```javascript
{
  _id: ObjectId,
  title: String,           // Titre de la chanson
  artist: {                // Référence à l'artiste
    type: ObjectId,
    ref: 'Artist'
  },
  album: {                 // Référence à l'album
    type: ObjectId,
    ref: 'Album'
  },
  duration: Number,        // Durée en secondes
  trackNumber: Number,     // Numéro de piste dans l'album
  audioFile: String,       // Chemin vers le fichier audio
  genres: [String],        // Genres musicaux
  playCount: Number,       // Nombre d'écoutes
  isExplicit: Boolean,     // Contenu explicite
  createdAt: Date,
  updatedAt: Date
}
```

### Collection `Playlist`

```javascript
{
  _id: ObjectId,
  name: String,            // Nom de la playlist
  description: String,     // Description
  owner: {                 // Référence à l'utilisateur propriétaire
    type: ObjectId,
    ref: 'User'
  },
  coverImage: String,      // URL de l'image de couverture
  isPublic: Boolean,       // Visibilité (publique/privée)
  songs: [                 // Liste des chansons
    {
      song: {
        type: ObjectId,
        ref: 'Song'
      },
      addedAt: Date        // Date d'ajout
    }
  ],
  followers: [             // Utilisateurs qui suivent la playlist
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Indexation

Pour optimiser les performances des requêtes, plusieurs index sont créés :

### Index sur la Collection `User`
- Index unique sur `email`
- Index unique sur `username`

### Index sur la Collection `Artist`
- Index en texte sur `name` pour la recherche
- Index sur `genres` pour le filtrage
- Index sur `popularity` pour le tri

### Index sur la Collection `Album`
- Index en texte sur `title` pour la recherche
- Index sur `artist` pour le filtrage
- Index sur `releaseDate` pour le tri
- Index sur `genres` pour le filtrage
- Index composé unique sur `[artist, title]`

### Index sur la Collection `Song`
- Index en texte sur `title` pour la recherche
- Index sur `artist` pour le filtrage
- Index sur `album` pour le filtrage
- Index sur `playCount` pour obtenir les chansons les plus populaires
- Index sur `[album, trackNumber]` pour trier les chansons dans un album
- Index composé unique sur `[artist, album, title]`

### Index sur la Collection `Playlist`
- Index en texte sur `[name, description]` pour la recherche
- Index sur `owner` pour obtenir les playlists d'un utilisateur
- Index sur `isPublic` pour filtrer les playlists publiques
- Index sur `followers` pour le filtrage
- Index composé unique sur `[owner, name]` 