const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schémas Mongoose
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  favoriteArtists: Array,
  listeningHistory: Array
}, { timestamps: true });

const artistSchema = new mongoose.Schema({
  name: String,
  bio: String,
  genres: Array,
  image: String,
  popularity: Number
}, { timestamps: true });

const albumSchema = new mongoose.Schema({
  title: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  releaseDate: Date,
  coverImage: String,
  genres: Array,
  description: String
}, { timestamps: true });

const songSchema = new mongoose.Schema({
  title: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  duration: Number,
  trackNumber: Number,
  audioFile: String,
  genres: Array,
  playCount: Number,
  isExplicit: Boolean
}, { timestamps: true });

const playlistSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: String,
  coverImage: String,
  isPublic: Boolean,
  songs: Array,
  followers: Array
}, { timestamps: true });

async function initDb() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/spotifake');
    console.log('MongoDB connecté');

    // Créer les modèles
    const User = mongoose.model('User', userSchema);
    const Artist = mongoose.model('Artist', artistSchema);
    const Album = mongoose.model('Album', albumSchema);
    const Song = mongoose.model('Song', songSchema);
    const Playlist = mongoose.model('Playlist', playlistSchema);

    // Vider les collections existantes
    console.log('Suppression des données existantes...');
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
    await Playlist.deleteMany({});

    console.log('Création des données de démonstration...');

    // Création des utilisateurs
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@spotifake.com',
      password: adminPassword,
      role: 'admin',
      favoriteArtists: [],
      listeningHistory: []
    });

    const regularUser = await User.create({
      username: 'user',
      email: 'user@spotifake.com',
      password: userPassword,
      role: 'user',
      favoriteArtists: [],
      listeningHistory: []
    });

    console.log('Utilisateurs créés:', adminUser._id, regularUser._id);

    // Création d'un artiste
    const artist = await Artist.create({
      name: 'Daft Punk',
      bio: 'Duo français de musique électronique',
      genres: ['electronic', 'house', 'techno'],
      image: 'daft_punk.jpg',
      popularity: 90
    });

    console.log('Artiste créé:', artist._id);

    // Création d'un album
    const album = await Album.create({
      title: 'Random Access Memories',
      artist: artist._id,
      releaseDate: new Date('2013-05-17'),
      coverImage: 'ram.jpg',
      genres: ['electronic', 'disco', 'funk'],
      description: 'Quatrième album studio de Daft Punk'
    });

    console.log('Album créé:', album._id);

    // Création de chansons
    const song1 = await Song.create({
      title: 'Get Lucky',
      artist: artist._id,
      album: album._id,
      duration: 369,
      trackNumber: 8,
      audioFile: 'get_lucky.mp3',
      genres: ['disco', 'funk'],
      playCount: 5000000,
      isExplicit: false
    });

    const song2 = await Song.create({
      title: 'Instant Crush',
      artist: artist._id,
      album: album._id,
      duration: 337,
      trackNumber: 5,
      audioFile: 'instant_crush.mp3',
      genres: ['electronic', 'rock'],
      playCount: 3000000,
      isExplicit: false
    });

    console.log('Chansons créées:', song1._id, song2._id);

    // Création d'une playlist
    const playlist = await Playlist.create({
      name: 'Mes favoris',
      description: 'Playlist de démonstration',
      owner: regularUser.username,
      coverImage: 'default-playlist.jpg',
      isPublic: true,
      songs: [
        { song: song1._id, addedAt: new Date() },
        { song: song2._id, addedAt: new Date() }
      ],
      followers: []
    });

    console.log('Playlist créée:', playlist._id);

    console.log('\nDonnées de démonstration créées avec succès');
    console.log('Vous pouvez maintenant utiliser Postman avec ces comptes:');
    console.log('- Admin: email=admin@spotifake.com, password=admin123');
    console.log('- User: email=user@spotifake.com, password=user123');

    // Déconnexion
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

initDb(); 