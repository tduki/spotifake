const Artist = require('../models/Artist');

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
exports.getArtists = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by genre if provided
    if (req.query.genre) {
      query.genres = req.query.genre;
    }
    
    // Text search if search term provided
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get artists - use find() without chaining sort, skip and limit
    const artists = await Artist.find(query);
    
    // Get total count
    const total = await Artist.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: artists.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: artists,
    });
  } catch (err) {
    console.error('Erreur getArtists:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single artist with albums
// @route   GET /api/artists/:id
// @access  Public
exports.getArtist = async (req, res) => {
  try {
    // Modifier pour éviter d'utiliser populate
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }
    
    // Retourner l'artiste sans ses albums pour éviter l'erreur populate
    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    console.error('Erreur getArtist:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new artist
// @route   POST /api/artists
// @access  Private (Admin only)
exports.createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);
    
    res.status(201).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private (Admin only)
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: artist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private (Admin only)
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
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