const mongoose = require('mongoose');
const { createModelAdapter } = require('../utils/modelAdapter');

const artistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide artist name'],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: 'default-artist.jpg',
    },
    popularity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
artistSchema.index({ name: 1 });
artistSchema.index({ genres: 1 });
artistSchema.index({ popularity: -1 });

// Créer le modèle Mongoose
const ArtistModel = mongoose.model('Artist', artistSchema);

// Créer l'adaptateur qui gère MongoDB ou la base mock
const Artist = createModelAdapter('artists', ArtistModel);

module.exports = Artist; 