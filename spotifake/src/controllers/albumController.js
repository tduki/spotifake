const Album = require('../models/Album');
const Artist = require('../models/Artist');

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
exports.getAlbums = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by artist if provided
    if (req.query.artist) {
      query.artist = req.query.artist;
    }
    
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
    
    // Get albums with options
    const albums = await Album.find(query, {
      sort: { releaseDate: -1 },
      skip: startIndex,
      limit: limit,
      populate: { path: 'artist', select: 'name' }
    });
    
    // Get total count
    const total = await Album.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: albums.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: albums,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single album with songs
// @route   GET /api/albums/:id
// @access  Public
exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name')
      .populate({
        path: 'songs',
        options: { sort: { trackNumber: 1 } },
      });
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new album
// @route   POST /api/albums
// @access  Private (Admin only)
exports.createAlbum = async (req, res) => {
  try {
    // Check if artist exists
    const artistExists = await Artist.findById(req.body.artist);
    if (!artistExists) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }
    
    const album = await Album.create(req.body);
    
    res.status(201).json({
      success: true,
      data: album,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Private (Admin only)
exports.updateAlbum = async (req, res) => {
  try {
    // If artist is being updated, check if it exists
    if (req.body.artist) {
      const artistExists = await Artist.findById(req.body.artist);
      if (!artistExists) {
        return res.status(404).json({
          success: false,
          message: 'Artist not found',
        });
      }
    }
    
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Private (Admin only)
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
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