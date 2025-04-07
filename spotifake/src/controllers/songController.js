const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const User = require('../models/User');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
exports.getSongs = async (req, res) => {
  try {
    // Build query
    let query = {};
    
    // Filter by artist if provided
    if (req.query.artist) {
      query.artist = req.query.artist;
    }
    
    // Filter by album if provided
    if (req.query.album) {
      query.album = req.query.album;
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
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Get songs
    const songs = await Song.find(query)
      .sort({ playCount: -1, title: 1 })
      .skip(startIndex)
      .limit(limit)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    
    // Get total count
    const total = await Song.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: songs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
exports.getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new song
// @route   POST /api/songs
// @access  Private (Admin only)
exports.createSong = async (req, res) => {
  try {
    // Check if artist exists
    const artistExists = await Artist.findById(req.body.artist);
    if (!artistExists) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found',
      });
    }
    
    // Check if album exists
    const albumExists = await Album.findById(req.body.album);
    if (!albumExists) {
      return res.status(404).json({
        success: false,
        message: 'Album not found',
      });
    }
    
    const song = await Song.create(req.body);
    
    res.status(201).json({
      success: true,
      data: song,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private (Admin only)
exports.updateSong = async (req, res) => {
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
    
    // If album is being updated, check if it exists
    if (req.body.album) {
      const albumExists = await Album.findById(req.body.album);
      if (!albumExists) {
        return res.status(404).json({
          success: false,
          message: 'Album not found',
        });
      }
    }
    
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: song,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private (Admin only)
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
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

// @desc    Play a song and increment play count
// @route   GET /api/songs/:id/play
// @access  Public (but track user if authenticated)
exports.playSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    // Increment play count
    song.playCount += 1;
    await song.save();
    
    // If user is authenticated, add to their listening history
    if (req.user) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            listeningHistory: {
              song: song._id,
              listenedAt: Date.now(),
            },
          },
        },
        { new: true }
      );
    }
    
    // Return song audio file
    res.status(200).json({
      success: true,
      data: {
        songId: song._id,
        title: song.title,
        artist: song.artist,
        audioFile: song.audioFile,
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

// @desc    Get top songs
// @route   GET /api/songs/top
// @access  Public
exports.getTopSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    
    const songs = await Song.find({})
      .sort({ playCount: -1 })
      .limit(limit)
      .populate('artist', 'name')
      .populate('album', 'title coverImage');
    
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
}; 