const express = require('express');
const {
  getSongs,
  getSong,
  createSong,
  updateSong,
  deleteSong,
  playSong,
  getTopSongs,
} = require('../controllers/songController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getSongs);
router.get('/top', getTopSongs);
router.get('/:id', getSong);
router.get('/:id/play', protect, playSong); // playback is authenticated to track history

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createSong);
router.put('/:id', protect, authorize('admin'), updateSong);
router.delete('/:id', protect, authorize('admin'), deleteSong);

module.exports = router; 