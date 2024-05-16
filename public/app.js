const express = require('express');
const path = require('path');

const app = express();

// Définir le dossier public pour les fichiers statiques
app.use(express.static(path.join(__dirname, 'res')));
app.use(express.static(path.join(__dirname, 'scr')));
app.use(express.static(path.join(__dirname, 'style')));

// Définir la route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});
app.get('/agenda', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'agenda.html'));
});

// Définir le port du serveur
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
