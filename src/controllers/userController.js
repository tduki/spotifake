const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Register a user
// @route   POST /auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
    
    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken',
      });
    }

    // Créer l'utilisateur sans cryptage du mot de passe
    const user = await User.create({
      username,
      email,
      password, // Stockage du mot de passe en clair
      role: 'user',
      favoriteArtists: [],
      listeningHistory: []
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'mockjwtsecret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erreur signup:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion:', email, password);

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Vérifier si le mot de passe correspond - comparaison simple sans bcrypt
    const isMatch = (password === user.password);
    console.log('Mot de passe stocké:', user.password);
    console.log('Mot de passe fourni:', password);
    console.log('Vérification mot de passe:', isMatch ? 'Succès' : 'Échec');
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'mockjwtsecret',
      { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update user
// @route   PUT /users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    // Make sure user is updating their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    // Don't allow role updates unless it's an admin
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    // Don't allow password updates through this route
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    // Make sure user is deleting their own profile or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this user',
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get user listening history
// @route   GET /users/:id/history
// @access  Private
exports.getUserHistory = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Make sure user is viewing their own history or is an admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user\'s history',
      });
    }

    res.status(200).json({
      success: true,
      data: user.listeningHistory || [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
}; 