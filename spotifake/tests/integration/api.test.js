const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../../server');
const User = require('../../src/models/User');
const Artist = require('../../src/models/Artist');

let authToken;
let testUserId;
let testArtistId;

// Connexion à la base de données de test avant les tests
beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/spotifake_test';
  await mongoose.connect(mongoUri);
  
  // Nettoyer les collections
  await User.deleteMany({});
  await Artist.deleteMany({});
  
  // Créer un utilisateur de test
  const testUser = await User.create({
    username: 'integrationtest',
    email: 'integration@test.com',
    password: 'test123456',
    role: 'admin'
  });
  
  testUserId = testUser._id;
});

// Déconnexion après les tests
afterAll(async () => {
  await mongoose.disconnect();
});

describe('API Integration Tests', () => {
  describe('Auth Routes', () => {
    test('POST /auth/login - should login and return token', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'integration@test.com',
          password: 'test123456'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      
      // Sauvegarder le token pour les prochains tests
      authToken = res.body.token;
    });
    
    test('GET /auth/me - should return current user profile', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('integration@test.com');
    });
  });
  
  describe('Artist Routes', () => {
    test('POST /artists - should create new artist', async () => {
      const res = await request(app)
        .post('/artists')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Integration Test Artist',
          bio: 'Created for testing',
          genres: ['test', 'integration'],
          image: 'test.jpg',
          popularity: 50
        });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Integration Test Artist');
      
      // Sauvegarder l'ID pour les prochains tests
      testArtistId = res.body.data._id;
    });
    
    test('GET /artists - should return all artists', async () => {
      const res = await request(app)
        .get('/artists');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
    
    test('GET /artists/:id - should return artist by ID', async () => {
      const res = await request(app)
        .get(`/artists/${testArtistId}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(testArtistId);
    });
    
    test('PUT /artists/:id - should update artist', async () => {
      const res = await request(app)
        .put(`/artists/${testArtistId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bio: 'Updated bio for testing'
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.bio).toBe('Updated bio for testing');
    });
  });
}); 