const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Song = require('../models/Song');
const Artist = require('../models/Artist');

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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
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

    console.log('Type de mot de passe stocké:', typeof user.password);
    console.log('Type de mot de passe fourni:', typeof password);
    
    // Vérifier si le mot de passe correspond - comparaison simple sans bcrypt
    const isMatch = password === user.password;
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

// @desc    Get recommended songs based on user's listening history
// @route   GET /users/:id/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son historique d'écoute
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Vérifier l'autorisation (utilisateur lui-même ou admin)
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    // Si l'historique d'écoute est vide, retourner des recommandations basées sur la popularité
    if (!user.listeningHistory || user.listeningHistory.length === 0) {
      const popularSongs = await Song.find()
        .sort({ playCount: -1 })
        .limit(10)
        .populate('artist', 'name')
        .populate('album', 'title coverImage');
        
      return res.status(200).json({
        success: true,
        message: 'Recommendations based on popularity',
        data: popularSongs,
      });
    }
    
    // Extraire les IDs des dernières chansons écoutées
    const recentSongIds = user.listeningHistory
      .sort((a, b) => new Date(b.listenedAt) - new Date(a.listenedAt))
      .slice(0, 10)
      .map(item => item.song);
    
    // Trouver les genres les plus écoutés
    const recentSongs = await Song.find({ _id: { $in: recentSongIds } });
    const genreCounts = {};
    recentSongs.forEach(song => {
      if (song.genres) {
        song.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });
    
    // Trier les genres par popularité
    const favoriteGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Trouver les artistes les plus écoutés
    const artistCounts = {};
    recentSongs.forEach(song => {
      if (song.artist) {
        const artistId = song.artist.toString();
        artistCounts[artistId] = (artistCounts[artistId] || 0) + 1;
      }
    });
    
    const favoriteArtistIds = Object.entries(artistCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
    
    // Recommandations basées sur les genres et artistes préférés, en excluant les chansons déjà écoutées
    const recommendations = await Song.find({
      $and: [
        { _id: { $nin: recentSongIds } },
        {
          $or: [
            { genres: { $in: favoriteGenres } },
            { artist: { $in: favoriteArtistIds } }
          ]
        }
      ]
    })
      .sort({ playCount: -1 })
      .limit(10)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    
    // Si pas assez de recommandations, compléter avec des chansons populaires
    if (recommendations.length < 5) {
      const additionalSongs = await Song.find({
        _id: { $nin: [...recentSongIds, ...recommendations.map(r => r._id)] }
      })
        .sort({ playCount: -1 })
        .limit(10 - recommendations.length)
        .populate('artist', 'name')
        .populate('album', 'title coverImage');
      
      recommendations.push(...additionalSongs);
    }
    
    res.status(200).json({
      success: true,
      message: 'Recommendations based on listening history',
      data: {
        recommendations,
        favoriteGenres,
        favoriteArtists: await Artist.find({ _id: { $in: favoriteArtistIds } }, 'name')
      },
    });
  } catch (err) {
    console.error('Recommendation error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Add song to user's listening history
// @route   POST /users/:id/history
// @access  Private
exports.addToListeningHistory = async (req, res) => {
  try {
    const { songId } = req.body;
    
    if (!songId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a song ID',
      });
    }
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Vérifier l'autorisation (utilisateur lui-même ou admin)
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }
    
    // Vérifier si la chanson existe
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    // Ajouter la chanson à l'historique d'écoute
    const historyEntry = {
      song: songId,
      listenedAt: new Date()
    };
    
    user.listeningHistory.push(historyEntry);
    await user.save();
    
    // Incrémenter le nombre d'écoutes de la chanson
    song.playCount = (song.playCount || 0) + 1;
    await song.save();
    
    res.status(200).json({
      success: true,
      message: 'Song added to listening history',
      data: historyEntry,
    });
  } catch (err) {
    console.error('Add to history error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get user's listening history
// @route   GET /users/:id/history
// @access  Private
exports.getListeningHistory = async (req, res) => {
  try {
    // Récupérer l'utilisateur
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Vérifier l'autorisation (utilisateur lui-même ou admin)
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }
    
    // Récupérer l'historique d'écoute avec les détails des chansons
    const history = await Promise.all(
      user.listeningHistory
        .sort((a, b) => new Date(b.listenedAt) - new Date(a.listenedAt))
        .map(async item => {
          const song = await Song.findById(item.song)
            .populate('artist', 'name')
            .populate('album', 'title coverImage');
          
          return {
            song,
            listenedAt: item.listenedAt
          };
        })
    );
    
    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
}; 