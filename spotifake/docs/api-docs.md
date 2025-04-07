# SpotiFake API Documentation

## Authentication Endpoints

### Register a New User
**Endpoint:** `POST /api/users/signup`  
**Access:** Public

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login
**Endpoint:** `POST /api/users/login`  
**Access:** Public

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## User Endpoints

### Get Current User
**Endpoint:** `GET /api/users/me`  
**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "favoriteArtists": [],
    "listeningHistory": []
  }
}
```

### Get User by ID
**Endpoint:** `GET /api/users/:id`  
**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "favoriteArtists": [],
    "listeningHistory": []
  }
}
```

### Update User
**Endpoint:** `PUT /api/users/:id`  
**Access:** Private (owner or admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "johndoe_updated"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109ca",
    "username": "johndoe_updated",
    "email": "john@example.com",
    "role": "user",
    "favoriteArtists": [],
    "listeningHistory": []
  }
}
```

### Delete User
**Endpoint:** `DELETE /api/users/:id`  
**Access:** Private (owner or admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### Get User Listening History
**Endpoint:** `GET /api/users/:id/history`  
**Access:** Private (owner or admin)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "song": {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Shape of You",
        "artist": {
          "_id": "60d0fe4f5311236168a109cc",
          "name": "Ed Sheeran"
        },
        "album": {
          "_id": "60d0fe4f5311236168a109cd",
          "title": "÷ (Divide)",
          "coverImage": "divide.jpg"
        },
        "duration": 233
      },
      "listenedAt": "2023-06-18T14:30:00.000Z",
      "_id": "60d0fe4f5311236168a109ce"
    }
  ]
}
```

## Artist Endpoints

### Get All Artists
**Endpoint:** `GET /api/artists`  
**Access:** Public

**Query Parameters:**
- `genre` - Filter by genre
- `search` - Text search
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Ed Sheeran",
      "bio": "British singer-songwriter",
      "genres": ["pop", "folk"],
      "image": "ed_sheeran.jpg",
      "popularity": 95
    },
    {
      "_id": "60d0fe4f5311236168a109cf",
      "name": "Adele",
      "bio": "English singer-songwriter",
      "genres": ["pop", "soul"],
      "image": "adele.jpg",
      "popularity": 93
    }
  ]
}
```

### Get Artist by ID
**Endpoint:** `GET /api/artists/:id`  
**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cc",
    "name": "Ed Sheeran",
    "bio": "British singer-songwriter",
    "genres": ["pop", "folk"],
    "image": "ed_sheeran.jpg",
    "popularity": 95,
    "albums": [
      {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "÷ (Divide)",
        "releaseDate": "2017-03-03T00:00:00.000Z",
        "coverImage": "divide.jpg",
        "genres": ["pop", "folk"]
      }
    ]
  }
}
```

### Create Artist
**Endpoint:** `POST /api/artists`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Taylor Swift",
  "bio": "American singer-songwriter",
  "genres": ["pop", "country"],
  "image": "taylor_swift.jpg",
  "popularity": 92
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d0",
    "name": "Taylor Swift",
    "bio": "American singer-songwriter",
    "genres": ["pop", "country"],
    "image": "taylor_swift.jpg",
    "popularity": 92
  }
}
```

### Update Artist
**Endpoint:** `PUT /api/artists/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "popularity": 97
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d0",
    "name": "Taylor Swift",
    "bio": "American singer-songwriter",
    "genres": ["pop", "country"],
    "image": "taylor_swift.jpg",
    "popularity": 97
  }
}
```

### Delete Artist
**Endpoint:** `DELETE /api/artists/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## Album Endpoints

### Get All Albums
**Endpoint:** `GET /api/albums`  
**Access:** Public

**Query Parameters:**
- `artist` - Filter by artist ID
- `genre` - Filter by genre
- `search` - Text search
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cd",
      "title": "÷ (Divide)",
      "artist": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Ed Sheeran"
      },
      "releaseDate": "2017-03-03T00:00:00.000Z",
      "coverImage": "divide.jpg",
      "genres": ["pop", "folk"]
    },
    {
      "_id": "60d0fe4f5311236168a109d1",
      "title": "25",
      "artist": {
        "_id": "60d0fe4f5311236168a109cf",
        "name": "Adele"
      },
      "releaseDate": "2015-11-20T00:00:00.000Z",
      "coverImage": "25.jpg",
      "genres": ["pop", "soul"]
    }
  ]
}
```

### Get Album by ID
**Endpoint:** `GET /api/albums/:id`  
**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cd",
    "title": "÷ (Divide)",
    "artist": {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Ed Sheeran"
    },
    "releaseDate": "2017-03-03T00:00:00.000Z",
    "coverImage": "divide.jpg",
    "genres": ["pop", "folk"],
    "songs": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "title": "Shape of You",
        "trackNumber": 4,
        "duration": 233,
        "playCount": 1500000
      },
      {
        "_id": "60d0fe4f5311236168a109d2",
        "title": "Castle on the Hill",
        "trackNumber": 2,
        "duration": 261,
        "playCount": 1200000
      }
    ]
  }
}
```

### Create Album
**Endpoint:** `POST /api/albums`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Folklore",
  "artist": "60d0fe4f5311236168a109d0",
  "releaseDate": "2020-07-24",
  "coverImage": "folklore.jpg",
  "genres": ["indie", "folk"],
  "description": "Taylor Swift's eighth studio album"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d3",
    "title": "Folklore",
    "artist": "60d0fe4f5311236168a109d0",
    "releaseDate": "2020-07-24T00:00:00.000Z",
    "coverImage": "folklore.jpg",
    "genres": ["indie", "folk"],
    "description": "Taylor Swift's eighth studio album"
  }
}
```

### Update Album
**Endpoint:** `PUT /api/albums/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Award-winning eighth studio album by Taylor Swift"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d3",
    "title": "Folklore",
    "artist": "60d0fe4f5311236168a109d0",
    "releaseDate": "2020-07-24T00:00:00.000Z",
    "coverImage": "folklore.jpg",
    "genres": ["indie", "folk"],
    "description": "Award-winning eighth studio album by Taylor Swift"
  }
}
```

### Delete Album
**Endpoint:** `DELETE /api/albums/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## Song Endpoints

### Get All Songs
**Endpoint:** `GET /api/songs`  
**Access:** Public

**Query Parameters:**
- `artist` - Filter by artist ID
- `album` - Filter by album ID
- `genre` - Filter by genre
- `search` - Text search
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "pagination": {
    "page": 1,
    "limit": 20,
    "pages": 1
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Shape of You",
      "artist": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Ed Sheeran"
      },
      "album": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "÷ (Divide)",
        "coverImage": "divide.jpg"
      },
      "duration": 233,
      "trackNumber": 4,
      "playCount": 1500000
    },
    {
      "_id": "60d0fe4f5311236168a109d2",
      "title": "Castle on the Hill",
      "artist": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Ed Sheeran"
      },
      "album": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "÷ (Divide)",
        "coverImage": "divide.jpg"
      },
      "duration": 261,
      "trackNumber": 2,
      "playCount": 1200000
    }
  ]
}
```

### Get Top Songs
**Endpoint:** `GET /api/songs/top`  
**Access:** Public

**Query Parameters:**
- `limit` - Number of top songs to retrieve (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d0fe4f5311236168a109cb",
      "title": "Shape of You",
      "artist": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Ed Sheeran"
      },
      "album": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "÷ (Divide)",
        "coverImage": "divide.jpg"
      },
      "duration": 233,
      "playCount": 1500000
    },
    {
      "_id": "60d0fe4f5311236168a109d2",
      "title": "Castle on the Hill",
      "artist": {
        "_id": "60d0fe4f5311236168a109cc",
        "name": "Ed Sheeran"
      },
      "album": {
        "_id": "60d0fe4f5311236168a109cd",
        "title": "÷ (Divide)",
        "coverImage": "divide.jpg"
      },
      "duration": 261,
      "playCount": 1200000
    }
  ]
}
```

### Get Song by ID
**Endpoint:** `GET /api/songs/:id`  
**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109cb",
    "title": "Shape of You",
    "artist": {
      "_id": "60d0fe4f5311236168a109cc",
      "name": "Ed Sheeran"
    },
    "album": {
      "_id": "60d0fe4f5311236168a109cd",
      "title": "÷ (Divide)",
      "coverImage": "divide.jpg"
    },
    "duration": 233,
    "trackNumber": 4,
    "audioFile": "shape_of_you.mp3",
    "genres": ["pop"],
    "playCount": 1500000,
    "isExplicit": false
  }
}
```

### Play Song
**Endpoint:** `GET /api/songs/:id/play`  
**Access:** Private (for tracking)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "songId": "60d0fe4f5311236168a109cb",
    "title": "Shape of You",
    "artist": "60d0fe4f5311236168a109cc",
    "audioFile": "shape_of_you.mp3"
  }
}
```

### Create Song
**Endpoint:** `POST /api/songs`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Cardigan",
  "artist": "60d0fe4f5311236168a109d0",
  "album": "60d0fe4f5311236168a109d3",
  "duration": 239,
  "trackNumber": 2,
  "audioFile": "cardigan.mp3",
  "genres": ["indie", "folk"],
  "isExplicit": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d4",
    "title": "Cardigan",
    "artist": "60d0fe4f5311236168a109d0",
    "album": "60d0fe4f5311236168a109d3",
    "duration": 239,
    "trackNumber": 2,
    "audioFile": "cardigan.mp3",
    "genres": ["indie", "folk"],
    "playCount": 0,
    "isExplicit": false
  }
}
```

### Update Song
**Endpoint:** `PUT /api/songs/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "trackNumber": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d4",
    "title": "Cardigan",
    "artist": "60d0fe4f5311236168a109d0",
    "album": "60d0fe4f5311236168a109d3",
    "duration": 239,
    "trackNumber": 1,
    "audioFile": "cardigan.mp3",
    "genres": ["indie", "folk"],
    "playCount": 0,
    "isExplicit": false
  }
}
```

### Delete Song
**Endpoint:** `DELETE /api/songs/:id`  
**Access:** Private (admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## Playlist Endpoints

### Get All Playlists
**Endpoint:** `GET /api/playlists`  
**Access:** Public/Private

**Query Parameters:**
- `user` - Filter by user ID
- `search` - Text search
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 1
  },
  "data": [
    {
      "_id": "60d0fe4f5311236168a109d5",
      "name": "My Favorites",
      "description": "My favorite songs of all time",
      "owner": {
        "_id": "60d0fe4f5311236168a109ca",
        "username": "johndoe"
      },
      "coverImage": "playlist1.jpg",
      "isPublic": true,
      "songs": [
        {
          "song": {
            "_id": "60d0fe4f5311236168a109cb",
            "title": "Shape of You",
            "artist": {
              "_id": "60d0fe4f5311236168a109cc",
              "name": "Ed Sheeran"
            },
            "album": {
              "_id": "60d0fe4f5311236168a109cd",
              "title": "÷ (Divide)",
              "coverImage": "divide.jpg"
            },
            "duration": 233
          },
          "addedAt": "2023-06-18T14:30:00.000Z",
          "_id": "60d0fe4f5311236168a109d6"
        }
      ]
    },
    {
      "_id": "60d0fe4f5311236168a109d7",
      "name": "Chill Vibes",
      "description": "Relaxing tunes",
      "owner": {
        "_id": "60d0fe4f5311236168a109ca",
        "username": "johndoe"
      },
      "coverImage": "playlist2.jpg",
      "isPublic": true,
      "songs": []
    }
  ]
}
```

### Get Playlist by ID
**Endpoint:** `GET /api/playlists/:id`  
**Access:** Public/Private (depends on playlist privacy)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d5",
    "name": "My Favorites",
    "description": "My favorite songs of all time",
    "owner": {
      "_id": "60d0fe4f5311236168a109ca",
      "username": "johndoe"
    },
    "coverImage": "playlist1.jpg",
    "isPublic": true,
    "songs": [
      {
        "song": {
          "_id": "60d0fe4f5311236168a109cb",
          "title": "Shape of You",
          "artist": {
            "_id": "60d0fe4f5311236168a109cc",
            "name": "Ed Sheeran"
          },
          "album": {
            "_id": "60d0fe4f5311236168a109cd",
            "title": "÷ (Divide)",
            "coverImage": "divide.jpg"
          },
          "duration": 233,
          "playCount": 1500000
        },
        "addedAt": "2023-06-18T14:30:00.000Z",
        "_id": "60d0fe4f5311236168a109d6"
      }
    ],
    "followers": []
  }
}
```

### Create Playlist
**Endpoint:** `POST /api/playlists`  
**Access:** Private

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Road Trip Mix",
  "description": "Songs for long drives",
  "isPublic": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d8",
    "name": "Road Trip Mix",
    "description": "Songs for long drives",
    "owner": "60d0fe4f5311236168a109ca",
    "coverImage": "default-playlist.jpg",
    "isPublic": true,
    "songs": [],
    "followers": []
  }
}
```

### Update Playlist
**Endpoint:** `PUT /api/playlists/:id`  
**Access:** Private (owner only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Ultimate Road Trip Mix",
  "coverImage": "road_trip.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d8",
    "name": "Ultimate Road Trip Mix",
    "description": "Songs for long drives",
    "owner": "60d0fe4f5311236168a109ca",
    "coverImage": "road_trip.jpg",
    "isPublic": true,
    "songs": [],
    "followers": []
  }
}
```

### Delete Playlist
**Endpoint:** `DELETE /api/playlists/:id`  
**Access:** Private (owner only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

### Add Song to Playlist
**Endpoint:** `POST /api/playlists/:id/songs`  
**Access:** Private (owner only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "songId": "60d0fe4f5311236168a109cb"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d8",
    "name": "Ultimate Road Trip Mix",
    "description": "Songs for long drives",
    "owner": "60d0fe4f5311236168a109ca",
    "coverImage": "road_trip.jpg",
    "isPublic": true,
    "songs": [
      {
        "song": "60d0fe4f5311236168a109cb",
        "addedAt": "2023-06-19T10:15:00.000Z",
        "_id": "60d0fe4f5311236168a109d9"
      }
    ],
    "followers": []
  }
}
```

### Remove Song from Playlist
**Endpoint:** `DELETE /api/playlists/:id/songs/:song_id`  
**Access:** Private (owner only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d0fe4f5311236168a109d8",
    "name": "Ultimate Road Trip Mix",
    "description": "Songs for long drives",
    "owner": "60d0fe4f5311236168a109ca",
    "coverImage": "road_trip.jpg",
    "isPublic": true,
    "songs": [],
    "followers": []
  }
}
``` 