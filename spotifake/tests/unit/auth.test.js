const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { login, signup } = require('../../src/controllers/userController');

// Mock des dépendances externes
jest.mock('../../src/models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

// Import du mock après le mock
const User = require('../../src/models/User');

describe('Auth Controller', () => {
  let req;
  let res;
  let mockUser;

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Créer des mocks pour req et res
    req = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      }
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    // Créer un utilisateur mock
    mockUser = {
      _id: 'user123',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'user'
    };
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      // Arrange
      req.body = {};

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please provide email and password'
      });
    });

    it('should return 401 if user is not found', async () => {
      // Arrange
      User.findOne.mockResolvedValue(null);

      // Act
      await login(req, res);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 401 if password does not match', async () => {
      // Arrange
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await login(req, res);

      // Assert
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, mockUser.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
    });

    it('should return 200 with token if login successful', async () => {
      // Arrange
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedToken');

      // Act
      await login(req, res);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        expect.any(String),
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: 'mockedToken',
        user: expect.objectContaining({
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role
        })
      });
    });

    it('should return 500 if server error occurs', async () => {
      // Arrange
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      // Act
      await login(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error',
        error: error.message
      });
    });
  });
}); 