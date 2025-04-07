const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createModelAdapter } = require('../utils/modelAdapter');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favoriteArtists: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Artist',
    }],
    listeningHistory: [{
      song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
      listenedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to sign JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Create indexes for frequently queried fields
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Créer le modèle Mongoose
const UserModel = mongoose.model('User', userSchema);

// Ajouter les méthodes aux documents utilisateurs en mode mock
const matchPasswordMock = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const getSignedJwtTokenMock = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET || 'mockjwtsecret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Créer l'adaptateur qui gère MongoDB ou la base mock
const User = createModelAdapter('users', UserModel);

// Ajouter des méthodes personnalisées à l'adaptateur
const originalCreate = User.create;
User.create = async function(data) {
  // Si le mot de passe est fourni, le hacher avant de créer l'utilisateur
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }
  
  const user = await originalCreate.call(this, data);
  
  // Ajouter les méthodes au document utilisateur en mode mock
  if (!mongoose.connection.readyState === 1) {
    user.matchPassword = matchPasswordMock;
    user.getSignedJwtToken = getSignedJwtTokenMock;
  }
  
  return user;
};

const originalFindOne = User.findOne;
User.findOne = async function(filter, options = {}) {
  const user = await originalFindOne.call(this, filter, options);
  
  // Ajouter les méthodes au document utilisateur en mode mock
  if (user && !mongoose.connection.readyState === 1) {
    user.matchPassword = matchPasswordMock;
    user.getSignedJwtToken = getSignedJwtTokenMock;
  }
  
  return user;
};

module.exports = User; 