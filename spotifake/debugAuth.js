const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition du schéma utilisateur
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  favoriteArtists: Array,
  listeningHistory: Array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function debugAuth() {
  try {
    // Connexion à MongoDB
    console.log('Connexion à MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/spotifake');
    console.log('MongoDB connecté');

    // Récupérer l'utilisateur admin
    const adminEmail = 'admin@spotifake.com';
    const adminPassword = 'admin123';

    console.log(`Recherche de l'utilisateur avec l'email: ${adminEmail}`);
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('❌ Utilisateur admin non trouvé dans la base de données');
      return;
    }

    console.log('✅ Utilisateur admin trouvé:', {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      passwordHash: adminUser.password.substring(0, 10) + '...',
      role: adminUser.role
    });

    // Tester le mot de passe
    console.log('\nTest de vérification du mot de passe:');
    console.log(`Mot de passe fourni: ${adminPassword}`);
    console.log(`Hash stocké: ${adminUser.password}`);

    try {
      console.log('Tentative de comparaison avec bcrypt.compare...');
      const isMatch = await bcrypt.compare(adminPassword, adminUser.password);
      console.log(`✅ Résultat de la comparaison: ${isMatch ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.log(`❌ Erreur lors de la comparaison du mot de passe: ${error.message}`);
      
      // Test manuel du hash
      console.log('\nEssai de génération d\'un nouveau hash avec le même mot de passe:');
      const newHash = await bcrypt.hash(adminPassword, 10);
      console.log(`Nouveau hash généré: ${newHash}`);
    }

    // Test avec l'utilisateur standard également
    const userEmail = 'user@spotifake.com';
    const userPassword = 'user123';

    console.log(`\nRecherche de l'utilisateur standard avec l'email: ${userEmail}`);
    const standardUser = await User.findOne({ email: userEmail });

    if (!standardUser) {
      console.log('❌ Utilisateur standard non trouvé dans la base de données');
      return;
    }

    console.log('✅ Utilisateur standard trouvé:', {
      id: standardUser._id,
      username: standardUser.username,
      email: standardUser.email,
      passwordHash: standardUser.password.substring(0, 10) + '...',
      role: standardUser.role
    });

    // Tester le mot de passe
    console.log('\nTest de vérification du mot de passe utilisateur standard:');
    try {
      const isMatch = await bcrypt.compare(userPassword, standardUser.password);
      console.log(`✅ Résultat de la comparaison: ${isMatch ? 'Succès' : 'Échec'}`);
    } catch (error) {
      console.log(`❌ Erreur lors de la comparaison du mot de passe: ${error.message}`);
    }

    // Déconnexion
    await mongoose.disconnect();
    console.log('\nDéconnexion de MongoDB');

  } catch (error) {
    console.error('Erreur:', error);
  }
}

debugAuth(); 