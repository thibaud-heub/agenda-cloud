var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');
const connectDB = require('./config/database');  // Assurez-vous que ce module est correctement configuré

var userRoutes = require('./routes/userRoutes');  // Assurez-vous que le chemin vers vos routes d'utilisateur est correct

var app = express();

// Connexion à la base de données
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ['keySession'],
    maxAge: 24 * 60 * 60 * 1000  // 24 heures
}));

function authRequired(req, res, next) {
    // Permettre le passage si la route est `/users/login` ou `/users/register`
    if (req.path === '/users/login' || req.path === '/users/register' || req.session.userId) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

// Middleware d'authentification
// Décommentez la ligne suivante pour activer la vérification d'authentification globale
// app.use(authRequired);

// Routes
app.use('/users', userRoutes);  // Assurez-vous que ce chemin est bien configuré

module.exports = app;
