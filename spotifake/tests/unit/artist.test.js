const { getArtists, getArtist, createArtist, updateArtist, deleteArtist } = require('../../src/controllers/artistController');

// Mock des dépendances
jest.mock('../../src/models/Artist', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn()
}));

// Import du mock après le mock
const Artist = require('../../src/models/Artist');

describe('Artist Controller', () => {
  let req;
  let res;
  let mockArtist;

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Créer des mocks pour req et res
    req = {
      params: { id: 'artist123' },
      query: {},
      body: {
        name: 'Test Artist',
        bio: 'Test Bio',
        genres: ['rock', 'pop'],
        image: 'test.jpg',
        popularity: 80
      }
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };

    // Créer un artiste mock
    mockArtist = {
      _id: 'artist123',
      name: 'Test Artist',
      bio: 'Test Bio',
      genres: ['rock', 'pop'],
      image: 'test.jpg',
      popularity: 80
    };
  });

  describe('getArtists', () => {
    it('should return all artists with pagination', async () => {
      // Arrange
      const mockArtists = [mockArtist, { ...mockArtist, _id: 'artist456', name: 'Another Artist' }];
      Artist.find.mockResolvedValue(mockArtists);
      Artist.countDocuments.mockResolvedValue(2);

      // Act
      await getArtists(req, res);

      // Assert
      expect(Artist.find).toHaveBeenCalledWith({});
      expect(Artist.countDocuments).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        total: 2,
        pagination: expect.any(Object),
        data: mockArtists
      });
    });

    it('should filter by genre if provided', async () => {
      // Arrange
      req.query.genre = 'rock';
      Artist.find.mockResolvedValue([mockArtist]);
      Artist.countDocuments.mockResolvedValue(1);

      // Act
      await getArtists(req, res);

      // Assert
      expect(Artist.find).toHaveBeenCalledWith({ genres: 'rock' });
      expect(Artist.countDocuments).toHaveBeenCalledWith({ genres: 'rock' });
    });

    it('should handle server errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Artist.find.mockRejectedValue(error);

      // Act
      await getArtists(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error',
        error: error.message
      });
    });
  });

  describe('getArtist', () => {
    it('should return an artist by id', async () => {
      // Arrange
      Artist.findById.mockResolvedValue(mockArtist);

      // Act
      await getArtist(req, res);

      // Assert
      expect(Artist.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtist
      });
    });

    it('should return 404 if artist not found', async () => {
      // Arrange
      Artist.findById.mockResolvedValue(null);

      // Act
      await getArtist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Artist not found'
      });
    });

    it('should handle server errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Artist.findById.mockRejectedValue(error);

      // Act
      await getArtist(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Server error',
        error: error.message
      });
    });
  });

  describe('createArtist', () => {
    it('should create an artist', async () => {
      // Arrange
      Artist.create.mockResolvedValue(mockArtist);

      // Act
      await createArtist(req, res);

      // Assert
      expect(Artist.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtist
      });
    });

    it('should handle server errors', async () => {
      // Arrange
      const error = new Error('Database error');
      Artist.create.mockRejectedValue(error);

      // Act
      await createArtist(req, res);

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