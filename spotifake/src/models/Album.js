const mongoose = require('mongoose');
const { createModelAdapter } = require('../utils/modelAdapter');

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide album title'],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    coverImage: {
      type: String,
      default: 'default-album.jpg',
    },
    genres: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
albumSchema.index({ title: 1 });
albumSchema.index({ artist: 1 });
albumSchema.index({ releaseDate: -1 });
albumSchema.index({ genres: 1 });

// Créer le modèle Mongoose
const AlbumModel = mongoose.model('Album', albumSchema);

// Créer l'adaptateur qui gère MongoDB ou la base mock
const Album = createModelAdapter('albums', AlbumModel);

module.exports = Album; 