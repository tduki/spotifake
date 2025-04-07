const mongoose = require('mongoose');
const { createModelAdapter } = require('../utils/modelAdapter');

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide playlist name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      required: [true, 'Please provide playlist owner'],
      ref: 'User',
    },
    coverImage: {
      type: String,
      default: 'default-playlist.jpg',
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    songs: [
      {
        song: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Song',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    followers: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
playlistSchema.index({ name: 1 });
playlistSchema.index({ owner: 1 });
playlistSchema.index({ isPublic: 1 });
playlistSchema.index({ 'songs.addedAt': -1 });

// Créer le modèle Mongoose
const PlaylistModel = mongoose.model('Playlist', playlistSchema);

// Créer l'adaptateur qui gère MongoDB ou la base mock
const Playlist = createModelAdapter('playlists', PlaylistModel);

module.exports = Playlist; 