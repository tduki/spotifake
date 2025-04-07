const express = require('express');
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require('../controllers/albumController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAlbums);
router.get('/:id', getAlbum);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createAlbum);
router.put('/:id', protect, authorize('admin'), updateAlbum);
router.delete('/:id', protect, authorize('admin'), deleteAlbum);

module.exports = router; 