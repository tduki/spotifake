const mongoose = require('mongoose');
const { createModelAdapter } = require('../utils/modelAdapter');

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide song title'],
      trim: true,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
      required: true,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: [true, 'Please provide song duration'],
    },
    trackNumber: {
      type: Number,
      default: 1,
    },
    audioFile: {
      type: String,
      required: [true, 'Please provide audio file path'],
    },
    genres: {
      type: [String],
      default: [],
    },
    playCount: {
      type: Number,
      default: 0,
    },
    isExplicit: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
songSchema.index({ title: 1 });
songSchema.index({ artist: 1 });
songSchema.index({ album: 1 });
songSchema.index({ genres: 1 });
songSchema.index({ playCount: -1 });

// Créer le modèle Mongoose
const SongModel = mongoose.model('Song', songSchema);

// Créer l'adaptateur qui gère MongoDB ou la base mock
const Song = createModelAdapter('songs', SongModel);

module.exports = Song; 