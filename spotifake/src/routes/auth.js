const express = require('express');
const {
  signup,
  login,
  getMe
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/signup', signup);
router.post('/login', login);

// Routes protégées
router.get('/me', protect, getMe);

module.exports = router; 