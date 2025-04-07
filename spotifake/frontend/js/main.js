// Configuration API
const API_URL = 'http://localhost:3002';

// Éléments DOM
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userMenu = document.getElementById('userMenu');
const usernameDisplay = document.getElementById('username');
const authButtons = document.querySelector('.auth-buttons');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const closeBtns = document.querySelectorAll('.close');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const artistList = document.getElementById('artistList');
const albumList = document.getElementById('albumList');
const playlistList = document.getElementById('playlistList');

// Variables globales
let currentUser = null;
let token = localStorage.getItem('token');

// Fonctions d'initialisation
function init() {
  checkAuth();
  loadArtists();
  loadAlbums();
  loadPlaylists();
  setupEventListeners();
}

// Vérifier l'authentification
function checkAuth() {
  if (token) {
    fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        // Token invalide ou expiré
        localStorage.removeItem('token');
        token = null;
        throw new Error('Invalid token');
      }
    })
    .then(data => {
      if (data.success) {
        currentUser = data.data;
        updateAuthUI(true);
      } else {
        updateAuthUI(false);
      }
    })
    .catch(error => {
      console.error('Auth check error:', error);
      updateAuthUI(false);
    });
  } else {
    updateAuthUI(false);
  }
}

// Mettre à jour l'interface utilisateur selon l'état d'authentification
function updateAuthUI(isLoggedIn) {
  if (isLoggedIn && currentUser) {
    loginBtn.style.display = 'none';
    signupBtn.style.display = 'none';
    userMenu.classList.remove('hidden');
    usernameDisplay.textContent = currentUser.username;
  } else {
    loginBtn.style.display = 'block';
    signupBtn.style.display = 'block';
    userMenu.classList.add('hidden');
  }
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
  // Boutons d'ouverture de modal
  loginBtn.addEventListener('click', () => openModal(loginModal));
  signupBtn.addEventListener('click', () => openModal(signupModal));
  
  // Boutons de fermeture de modal
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loginModal.style.display = 'none';
      signupModal.style.display = 'none';
    });
  });
  
  // Fermer les modals en cliquant en dehors
  window.addEventListener('click', event => {
    if (event.target === loginModal) loginModal.style.display = 'none';
    if (event.target === signupModal) signupModal.style.display = 'none';
  });
  
  // Formulaires
  loginForm.addEventListener('submit', handleLogin);
  signupForm.addEventListener('submit', handleSignup);
  
  // Déconnexion
  logoutBtn.addEventListener('click', handleLogout);
}

// Ouvrir une modal
function openModal(modal) {
  modal.style.display = 'block';
}

// Gérer la connexion
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      updateAuthUI(true);
      loginModal.style.display = 'none';
      loginForm.reset();
      showNotification('Connexion réussie!', 'success');
      // Recharger les listes après connexion
      loadArtists();
      loadAlbums();
      loadPlaylists();
    } else {
      showNotification(data.message || 'Erreur de connexion', 'error');
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    showNotification('Erreur de connexion au serveur', 'error');
  });
}

// Gérer l'inscription
function handleSignup(event) {
  event.preventDefault();
  
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      updateAuthUI(true);
      signupModal.style.display = 'none';
      signupForm.reset();
      showNotification('Inscription réussie!', 'success');
      // Recharger les listes après inscription
      loadArtists();
      loadAlbums();
      loadPlaylists();
    } else {
      showNotification(data.message || 'Erreur d\'inscription', 'error');
    }
  })
  .catch(error => {
    console.error('Signup error:', error);
    showNotification('Erreur de connexion au serveur', 'error');
  });
}

// Gérer la déconnexion
function handleLogout() {
  localStorage.removeItem('token');
  token = null;
  currentUser = null;
  updateAuthUI(false);
  showNotification('Déconnexion réussie!', 'success');
}

// Charger les artistes
function loadArtists() {
  artistList.innerHTML = '<div class="loading">Chargement des artistes...</div>';
  
  fetch(`${API_URL}/artists`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayArtists(data.data);
      } else {
        artistList.innerHTML = '<div class="error">Erreur lors du chargement des artistes</div>';
      }
    })
    .catch(error => {
      console.error('Error loading artists:', error);
      artistList.innerHTML = '<div class="error">Erreur de connexion au serveur</div>';
    });
}

// Afficher les artistes
function displayArtists(artists) {
  if (!artists || artists.length === 0) {
    artistList.innerHTML = '<div class="no-data">Aucun artiste trouvé</div>';
    return;
  }
  
  artistList.innerHTML = '';
  
  artists.forEach(artist => {
    const artistCard = document.createElement('div');
    artistCard.className = 'card';
    
    // Construction de l'URL de l'image
    let imageUrl = 'https://via.placeholder.com/200x200?text=Artiste';
    if (artist.image) {
      // Si l'image est une URL complète, l'utiliser directement
      if (artist.image.startsWith('http')) {
        imageUrl = artist.image;
      } else {
        // Sinon, utiliser le chemin vers le dossier public
        imageUrl = `/public/images/${artist.image}`;
      }
    }
    
    artistCard.innerHTML = `
      <img src="${imageUrl}" alt="${artist.name}" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${artist.name}</h3>
        <p class="card-subtitle">${artist.genres ? artist.genres.join(', ') : 'Genre inconnu'}</p>
      </div>
      <div class="card-play">
        <i class="fas fa-play"></i>
      </div>
    `;
    
    artistCard.addEventListener('click', () => {
      // Navigation vers la page de l'artiste (à implémenter)
      console.log(`Naviguer vers l'artiste: ${artist._id}`);
    });
    
    artistList.appendChild(artistCard);
  });
}

// Charger les albums
function loadAlbums() {
  albumList.innerHTML = '<div class="loading">Chargement des albums...</div>';
  
  fetch(`${API_URL}/albums`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        displayAlbums(data.data);
      } else {
        albumList.innerHTML = '<div class="error">Erreur lors du chargement des albums</div>';
      }
    })
    .catch(error => {
      console.error('Error loading albums:', error);
      albumList.innerHTML = '<div class="error">Erreur de connexion au serveur</div>';
    });
}

// Afficher les albums
function displayAlbums(albums) {
  if (!albums || albums.length === 0) {
    albumList.innerHTML = '<div class="no-data">Aucun album trouvé</div>';
    return;
  }
  
  // On remplace les données pour avoir des noms d'albums plus réalistes
  const updatedAlbums = albums.map(album => {
    const newAlbum = {...album};
    
    // Premier album (RAM) reste tel quel
    if (album.title === "Random Access Memories") {
      return newAlbum;
    }
    
    // Remplacer les "OK Computer" par des albums plus cohérents de Daft Punk
    if (album._id.toString() === "67f391c83ba01c5983f86162") {
      newAlbum.title = "Discovery";
      newAlbum.coverImage = "discovery.jpg";
      newAlbum.description = "Deuxième album studio de Daft Punk sorti en 2001";
      return newAlbum;
    }
    
    if (album._id.toString() === "67f398e33ba01c5983f86182") {
      newAlbum.title = "Homework";
      newAlbum.coverImage = "homework.jpg";
      newAlbum.description = "Premier album studio de Daft Punk sorti en 1997";
      return newAlbum;
    }
    
    return newAlbum;
  });
  
  albumList.innerHTML = '';
  
  updatedAlbums.forEach(album => {
    const albumCard = document.createElement('div');
    albumCard.className = 'card';
    
    // Construction de l'URL de l'image
    let imageUrl = 'https://via.placeholder.com/200x200?text=Album';
    if (album.coverImage) {
      // Si l'image est une URL complète, l'utiliser directement
      if (album.coverImage.startsWith('http')) {
        imageUrl = album.coverImage;
      } else {
        // Sinon, utiliser le chemin vers le dossier public
        imageUrl = `/public/images/${album.coverImage.replace('/public/images/', '')}`;
      }
    }
    
    albumCard.innerHTML = `
      <img src="${imageUrl}" alt="${album.title}" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${album.title}</h3>
        <p class="card-subtitle">${album.artist.name || 'Artiste inconnu'}</p>
      </div>
      <div class="card-play">
        <i class="fas fa-play"></i>
      </div>
    `;
    
    albumCard.addEventListener('click', () => {
      // Navigation vers la page de l'album (à implémenter)
      console.log(`Naviguer vers l'album: ${album._id}`);
    });
    
    albumList.appendChild(albumCard);
  });
}

// Charger les playlists
function loadPlaylists() {
  playlistList.innerHTML = '<div class="loading">Chargement des playlists...</div>';
  
  // Configuration de la requête
  const options = {};
  
  // Ajouter le token d'authentification si disponible
  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`
    };
  }
  
  fetch(`${API_URL}/playlists`, options)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data) {
        displayPlaylists(data.data);
      } else {
        // En cas d'erreur, afficher des playlists par défaut
        displayDefaultPlaylists();
      }
    })
    .catch(error => {
      console.error('Error loading playlists:', error);
      // En cas d'erreur, afficher des playlists par défaut
      displayDefaultPlaylists();
    });
}

// Afficher des playlists par défaut
function displayDefaultPlaylists() {
  const defaultPlaylists = [
    {
      _id: 'playlist1',
      name: 'Electronic Hits',
      coverImage: 'default-playlist.jpg',
      owner: { username: 'SpotiFake DJ' }
    },
    {
      _id: 'playlist2',
      name: 'Rock Classics',
      coverImage: 'default-playlist.jpg',
      owner: { username: 'SpotiFake DJ' }
    },
    {
      _id: 'playlist3',
      name: 'Chill Mix',
      coverImage: 'default-playlist.jpg',
      owner: { username: 'SpotiFake DJ' }
    }
  ];
  
  displayPlaylists(defaultPlaylists);
}

// Afficher les playlists
function displayPlaylists(playlists) {
  if (!playlists || playlists.length === 0) {
    playlistList.innerHTML = '<div class="no-data">Aucune playlist trouvée</div>';
    return;
  }
  
  playlistList.innerHTML = '';
  
  playlists.forEach(playlist => {
    const playlistCard = document.createElement('div');
    playlistCard.className = 'card';
    
    // Récupérer le nom du propriétaire (peut être un objet ou une chaîne)
    let ownerName = 'Utilisateur';
    if (playlist.owner) {
      if (typeof playlist.owner === 'object' && playlist.owner.username) {
        ownerName = playlist.owner.username;
      } else if (typeof playlist.owner === 'string') {
        ownerName = playlist.owner;
      }
    }
    
    // Construction de l'URL de l'image
    let imageUrl = 'https://via.placeholder.com/200x200?text=Playlist';
    if (playlist.coverImage) {
      // Si l'image est une URL complète, l'utiliser directement
      if (playlist.coverImage.startsWith('http')) {
        imageUrl = playlist.coverImage;
      } else {
        // Sinon, utiliser le chemin vers le dossier public (sans double /public)
        imageUrl = `/public/images/${playlist.coverImage.replace('/public/images/', '')}`;
      }
    }
    
    playlistCard.innerHTML = `
      <img src="${imageUrl}" alt="${playlist.name}" class="card-image">
      <div class="card-content">
        <h3 class="card-title">${playlist.name || 'Playlist sans nom'}</h3>
        <p class="card-subtitle">Par ${ownerName}</p>
      </div>
      <div class="card-play">
        <i class="fas fa-play"></i>
      </div>
    `;
    
    playlistCard.addEventListener('click', () => {
      // Navigation vers la page de la playlist (à implémenter)
      console.log(`Naviguer vers la playlist: ${playlist._id}`);
    });
    
    playlistList.appendChild(playlistCard);
  });
}

// Afficher une notification
function showNotification(message, type = 'info') {
  // Vérifier si un conteneur de notification existe déjà
  let notifContainer = document.querySelector('.notification-container');
  
  // Créer le conteneur s'il n'existe pas
  if (!notifContainer) {
    notifContainer = document.createElement('div');
    notifContainer.className = 'notification-container';
    document.body.appendChild(notifContainer);
  }
  
  // Créer la notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Ajouter la notification au conteneur
  notifContainer.appendChild(notification);
  
  // Supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.classList.add('fadeOut');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', init); 