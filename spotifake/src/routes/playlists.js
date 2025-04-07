const express = require('express');
const {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public/Private routes (will show different results based on auth)
router.get('/', getPlaylists);
router.get('/:id', getPlaylist);

// Protected routes (user must be authenticated)
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:song_id', protect, removeSongFromPlaylist);

module.exports = router; 