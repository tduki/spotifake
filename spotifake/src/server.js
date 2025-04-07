// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Route pour servir l'application frontend
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
}); 