const express = require('express');
const {
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
} = require('../controllers/artistController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getArtists);
router.get('/:id', getArtist);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createArtist);
router.put('/:id', protect, authorize('admin'), updateArtist);
router.delete('/:id', protect, authorize('admin'), deleteArtist);

module.exports = router; 