/**
 * Mock DB - Simule une base de données MongoDB en mémoire
 * À utiliser lorsque MongoDB n'est pas disponible
 */

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class MockCollection {
  constructor(name) {
    this.name = name;
    this.data = [];
    this.indexes = {};
  }

  async insertOne(doc) {
    const id = uuidv4();
    const now = new Date();
    const newDoc = {
      ...doc,
      _id: id,
      createdAt: now,
      updatedAt: now
    };
    this.data.push(newDoc);
    return { insertedId: id, acknowledged: true };
  }

  async insertMany(docs) {
    const insertedIds = [];
    for (const doc of docs) {
      const result = await this.insertOne(doc);
      insertedIds.push(result.insertedId);
    }
    return { insertedIds, acknowledged: true };
  }

  async findOne(query = {}) {
    return this.data.find(item => this._matchesQuery(item, query)) || null;
  }

  async findById(id) {
    return this.data.find(item => item._id === id) || null;
  }

  async find(query = {}) {
    return {
      sort: (sortObj) => {
        const [field, direction] = Object.entries(sortObj)[0];
        const sorted = [...this.data].filter(item => this._matchesQuery(item, query))
          .sort((a, b) => {
            if (direction === 1) {
              return a[field] > b[field] ? 1 : -1;
            } else {
              return a[field] < b[field] ? 1 : -1;
            }
          });
        return {
          skip: (n) => {
            const skipped = sorted.slice(n);
            return {
              limit: (n) => skipped.slice(0, n),
              toArray: () => skipped
            };
          },
          limit: (n) => sorted.slice(0, n),
          toArray: () => sorted
        };
      },
      toArray: () => this.data.filter(item => this._matchesQuery(item, query))
    };
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;

    const doc = this.data[index];
    const updated = {
      ...doc,
      ...update,
      updatedAt: new Date()
    };
    this.data[index] = updated;
    
    return options.new ? updated : doc;
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;

    const deleted = this.data[index];
    this.data.splice(index, 1);
    return deleted;
  }

  async countDocuments(query = {}) {
    return this.data.filter(item => this._matchesQuery(item, query)).length;
  }

  _matchesQuery(item, query) {
    if (!query || Object.keys(query).length === 0) return true;
    
    // Handle special MongoDB operators
    if (query.$or) {
      return query.$or.some(condition => this._matchesQuery(item, condition));
    }
    
    return Object.entries(query).every(([key, value]) => {
      // Handle nested paths (e.g., 'user.name')
      if (key.includes('.')) {
        const parts = key.split('.');
        let current = item;
        for (const part of parts.slice(0, -1)) {
          current = current[part];
          if (current === undefined) return false;
        }
        return current[parts[parts.length - 1]] === value;
      }
      
      // Handle regular fields
      return item[key] === value;
    });
  }
}

const collections = {
  users: new MockCollection('users'),
  artists: new MockCollection('artists'),
  albums: new MockCollection('albums'),
  songs: new MockCollection('songs'),
  playlists: new MockCollection('playlists')
};

// Initialiser des données de démo
const initDemoData = async () => {
  // Créer un utilisateur admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await collections.users.insertOne({
    username: 'admin',
    email: 'admin@spotifake.com',
    password: passwordHash,
    role: 'admin',
    favoriteArtists: [],
    listeningHistory: []
  });

  // Créer un utilisateur normal
  const userPasswordHash = await bcrypt.hash('user123', 10);
  await collections.users.insertOne({
    username: 'user',
    email: 'user@spotifake.com',
    password: userPasswordHash,
    role: 'user',
    favoriteArtists: [],
    listeningHistory: []
  });

  // Créer un artiste
  const artistId = (await collections.artists.insertOne({
    name: 'Daft Punk',
    bio: 'Duo français de musique électronique',
    genres: ['electronic', 'house', 'techno'],
    image: 'daft_punk.jpg',
    popularity: 90
  })).insertedId;

  // Créer un album
  const albumId = (await collections.albums.insertOne({
    title: 'Random Access Memories',
    artist: artistId,
    releaseDate: new Date('2013-05-17'),
    coverImage: 'ram.jpg',
    genres: ['electronic', 'disco', 'funk'],
    description: 'Quatrième album studio de Daft Punk'
  })).insertedId;

  // Créer quelques chansons
  const songId1 = (await collections.songs.insertOne({
    title: 'Get Lucky',
    artist: artistId,
    album: albumId,
    duration: 369,
    trackNumber: 8,
    audioFile: 'get_lucky.mp3',
    genres: ['disco', 'funk'],
    playCount: 5000000,
    isExplicit: false
  })).insertedId;

  const songId2 = (await collections.songs.insertOne({
    title: 'Instant Crush',
    artist: artistId,
    album: albumId,
    duration: 337,
    trackNumber: 5,
    audioFile: 'instant_crush.mp3',
    genres: ['electronic', 'rock'],
    playCount: 3000000,
    isExplicit: false
  })).insertedId;

  // Créer une playlist
  await collections.playlists.insertOne({
    name: 'Mes favoris',
    description: 'Playlist de démonstration',
    owner: 'user',
    coverImage: 'default-playlist.jpg',
    isPublic: true,
    songs: [
      { song: songId1, addedAt: new Date() },
      { song: songId2, addedAt: new Date() }
    ],
    followers: []
  });

  console.log('Données de démonstration initialisées dans la base de données mock');
};

const mockDb = {
  collections,
  initDemoData
};

module.exports = mockDb; 