const mongoose = require('mongoose');

async function clearAndCreateUsers() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/spotifake');
    console.log('MongoDB connecté');

    // Définir un schéma utilisateur simplifié
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String
    });

    // Créer un modèle utilisateur
    const User = mongoose.model('User', userSchema);

    // Supprimer les utilisateurs existants
    console.log('Suppression des utilisateurs existants...');
    await User.deleteMany({});
    console.log('Utilisateurs supprimés');

    // Créer de nouveaux utilisateurs avec des mots de passe en clair
    console.log('Création de nouveaux utilisateurs...');
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@spotifake.com',
      password: 'admin123',
      role: 'admin'
    });

    const user = await User.create({
      username: 'user',
      email: 'user@spotifake.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Utilisateurs créés:');
    console.log('- Admin ID:', admin._id);
    console.log('- User ID:', user._id);

    // Déconnexion
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB');
    console.log('\nVous pouvez maintenant vous connecter avec:');
    console.log('- Admin: admin@spotifake.com / admin123');
    console.log('- User: user@spotifake.com / user123');

  } catch (error) {
    console.error('Erreur:', error);
  }
}

clearAndCreateUsers(); 