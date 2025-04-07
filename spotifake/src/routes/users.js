const express = require('express');
const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserHistory,
  getRecommendations,
  getListeningHistory,
  addToListeningHistory
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protégées
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
router.get('/:id/history', protect, getUserHistory);

// Routes pour les recommandations et l'historique d'écoute
router.get('/:id/recommendations', protect, getRecommendations);
router.get('/:id/history', protect, getListeningHistory);
router.post('/:id/history', protect, addToListeningHistory);

module.exports = router; 