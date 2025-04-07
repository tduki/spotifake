const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./src/utils/swagger');
const errorHandler = require('./src/middleware/errorHandler');
require('dotenv').config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Variable pour suivre l'état de la connexion MongoDB
let mongoConnected = false;

// Fonction pour vérifier si MongoDB est connecté
function isMongoConnected() {
  return mongoConnected;
}

// Middlewares
app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend et du dossier public
app.use('/static', express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route pour servir l'application frontend
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// Configuration de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Routes de base
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue sur l\'API SpotiFake',
    mongoStatus: isMongoConnected() ? 'connecté' : 'non connecté',
    documentation: `/api-docs`,
    endpoints: {
      auth: '/auth',
      users: '/users',
      artists: '/artists',
      albums: '/albums',
      songs: '/songs',
      playlists: '/playlists'
    }
  });
});

app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Le serveur fonctionne correctement',
    mongoStatus: isMongoConnected() ? 'connecté' : 'non connecté',
    time: new Date().toISOString()
  });
});

// Initialiser les routes avant la connexion à MongoDB
initRoutes();

// Tentative de connexion à MongoDB
console.log('Tentative de connexion à MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB établie');
    mongoConnected = true;
  })
  .catch(err => {
    console.error('Échec de connexion à MongoDB:', err.message);
    console.log('Veuillez vérifier votre connexion à MongoDB');
  });

// Fonction pour initialiser les routes
function initRoutes() {
  // Importer les routes
  const authRoutes = require('./src/routes/auth');
  const userRoutes = require('./src/routes/users');
  const artistRoutes = require('./src/routes/artists');
  const albumRoutes = require('./src/routes/albums');
  const songRoutes = require('./src/routes/songs');
  const playlistRoutes = require('./src/routes/playlists');

  // Configurer les routes
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/artists', artistRoutes);
  app.use('/albums', albumRoutes);
  app.use('/songs', songRoutes);
  app.use('/playlists', playlistRoutes);
}

// Middleware de gestion des erreurs
app.use(errorHandler);

// Start server without waiting for MongoDB connection
console.log('Démarrage du serveur...');
const server = app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  console.log(`Accédez à http://localhost:${PORT} pour voir l'API`);
  console.log(`Documentation Swagger disponible à l'adresse: http://localhost:${PORT}/api-docs`);
});

// Gestion de l'arrêt propre du serveur
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Serveur arrêté');
    mongoose.connection.close(false, () => {
      console.log('Connexion MongoDB fermée');
      process.exit(0);
    });
  });
});

// Exporter l'app pour les tests et la variable isMongoConnected
module.exports = { app, isMongoConnected }; 