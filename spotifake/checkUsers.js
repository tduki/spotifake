const mongoose = require('mongoose');

// Schéma utilisateur simplifié pour la vérification
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String
});

console.log('Connexion à MongoDB...');
mongoose.connect('mongodb://localhost:27017/spotifake')
  .then(async () => {
    console.log('MongoDB connecté');
    
    // Créer un modèle temporaire pour accéder à la collection
    const User = mongoose.model('User', userSchema);
    
    // Rechercher tous les utilisateurs
    const users = await User.find({});
    
    console.log(`Nombre d'utilisateurs trouvés: ${users.length}`);
    
    // Afficher les utilisateurs (sans le mot de passe complet)
    users.forEach(user => {
      console.log({
        _id: user._id,
        username: user.username,
        email: user.email,
        password: user.password ? `${user.password.substring(0, 10)}...` : null,
        role: user.role
      });
    });
    
    // Rechercher spécifiquement les utilisateurs de test
    const admin = await User.findOne({ email: 'admin@spotifake.com' });
    const regularUser = await User.findOne({ email: 'user@spotifake.com' });
    
    console.log('\nUtilisateur admin trouvé:', admin ? 'Oui' : 'Non');
    console.log('Utilisateur standard trouvé:', regularUser ? 'Oui' : 'Non');
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur MongoDB:', err);
    process.exit(1);
  }); 