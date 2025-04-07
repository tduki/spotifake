const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const User = require('../models/User');

// @desc    Get all playlists (public or user's own)
// @route   GET /api/playlists
// @access  Public/Private
exports.getPlaylists = async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated, show their private playlists too
    if (req.user) {
      // Show public playlists OR user's own playlists (public or private)
      query = {
        $or: [
          { isPublic: true },
          { owner: req.user.id }
        ]
      };
    } else {
      // Only show public playlists to unauthenticated users
      query = { isPublic: true };
    }
    
    // Filter by owner if requested
    if (req.query.user) {
      // If requesting a specific user's playlists, only show public ones
      // unless the user is requesting their own
      if (req.user && req.user.id === req.query.user) {
        query = { owner: req.query.user };
      } else {
        query = { owner: req.query.user, isPublic: true };
      }
    }
    
    // Text search if search term provided
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Get playlists with options
    const playlists = await Playlist.find(query, {
      sort: { createdAt: -1 },
      skip: startIndex,
      limit: limit,
      populate: [
        { path: 'owner', select: 'username' },
        {
          path: 'songs.song',
          select: 'title artist album duration',
          populate: [
            { path: 'artist', select: 'name' },
            { path: 'album', select: 'title coverImage' }
          ]
        }
      ]
    });
    
    // Get total count
    const total = await Playlist.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: playlists.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: playlists,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public/Private
exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id, {
      populate: [
        { path: 'owner', select: 'username' },
        {
          path: 'songs.song',
          select: 'title artist album duration playCount',
          populate: [
            { path: 'artist', select: 'name' },
            { path: 'album', select: 'title coverImage' }
          ]
        }
      ]
    });
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }
    
    // Check if playlist is private and user is not the owner
    if (!playlist.isPublic && (!req.user || req.user.id !== playlist.owner.id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this playlist',
      });
    }
    
    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res) => {
  try {
    // Set owner to current user
    req.body.owner = req.user.id;
    
    const playlist = await Playlist.create(req.body);
    
    res.status(201).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
exports.updatePlaylist = async (req, res) => {
  try {
    let playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }
    
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist',
      });
    }
    
    // Don't allow owner to be changed
    if (req.body.owner) {
      delete req.body.owner;
    }
    
    // Update playlist
    playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }
    
    // Make sure user is playlist owner or admin
    if (playlist.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this playlist',
      });
    }
    
    await playlist.deleteOne();
    
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

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
exports.addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;
    
    if (!songId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide song ID',
      });
    }
    
    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found',
      });
    }
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }
    
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist',
      });
    }
    
    // Check if song is already in the playlist
    const songExists = playlist.songs.find(s => s.song.toString() === songId);
    if (songExists) {
      return res.status(400).json({
        success: false,
        message: 'Song already in playlist',
      });
    }
    
    // Add song to playlist
    playlist.songs.push({
      song: songId,
      addedAt: Date.now(),
    });
    
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:song_id
// @access  Private
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }
    
    // Make sure user is playlist owner
    if (playlist.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist',
      });
    }
    
    // Check if song is in the playlist
    const songIndex = playlist.songs.findIndex(s => s.song.toString() === req.params.song_id);
    if (songIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Song not found in playlist',
      });
    }
    
    // Remove song from playlist
    playlist.songs.splice(songIndex, 1);
    
    await playlist.save();
    
    res.status(200).json({
      success: true,
      data: playlist,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
}; 