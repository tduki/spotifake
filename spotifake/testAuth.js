const axios = require('axios');

async function testAuth() {
  console.log('Test d\'authentification...');
  
  try {
    // Essai avec l'admin
    console.log('Test de connexion admin...');
    console.log('URL: http://localhost:3002/auth/login');
    console.log('Payload:', JSON.stringify({
      email: 'admin@spotifake.com',
      password: 'admin123'
    }, null, 2));
    
    const adminResponse = await axios.post('http://localhost:3002/auth/login', {
      email: 'admin@spotifake.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Authentification admin réussie!');
    console.log('Token:', adminResponse.data.token);
    console.log('Utilisateur:', adminResponse.data.user);
    
  } catch (error) {
    console.error('Erreur authentification admin:');
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      console.error('Status:', error.response.status);
      console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Pas de réponse reçue. Vérifiez que le serveur est bien démarré.');
      console.error(error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration de la requête:', error.message);
    }
    
    // Essayons avec l'utilisateur standard
    try {
      console.log('\nTest de connexion utilisateur standard...');
      console.log('URL: http://localhost:3002/auth/login');
      console.log('Payload:', JSON.stringify({
        email: 'user@spotifake.com',
        password: 'user123'
      }, null, 2));
      
      const userResponse = await axios.post('http://localhost:3002/auth/login', {
        email: 'user@spotifake.com',
        password: 'user123'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Authentification utilisateur réussie!');
      console.log('Token:', userResponse.data.token);
      console.log('Utilisateur:', userResponse.data.user);
      
    } catch (userError) {
      console.error('Erreur authentification utilisateur:');
      if (userError.response) {
        console.error('Status:', userError.response.status);
        console.error('Data:', JSON.stringify(userError.response.data, null, 2));
      } else if (userError.request) {
        console.error('Pas de réponse reçue');
      } else {
        console.error('Erreur:', userError.message);
      }
      
      // Test d'inscription
      try {
        console.log('\nTest d\'inscription...');
        console.log('URL: http://localhost:3002/auth/signup');
        console.log('Payload:', JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'test123'
        }, null, 2));
        
        const signupResponse = await axios.post('http://localhost:3002/auth/signup', {
          username: 'testuser',
          email: 'test@example.com',
          password: 'test123'
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Inscription réussie!');
        console.log('Token:', signupResponse.data.token);
        console.log('Utilisateur:', signupResponse.data.user);
        
      } catch (signupError) {
        console.error('Erreur inscription:');
        if (signupError.response) {
          console.error('Status:', signupError.response.status);
          console.error('Data:', JSON.stringify(signupError.response.data, null, 2));
        } else if (signupError.request) {
          console.error('Pas de réponse reçue');
        } else {
          console.error('Erreur:', signupError.message);
        }
      }
    }
  }
}

testAuth(); 