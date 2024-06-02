var express = require('express');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var logger = require('morgan');
const connectDB = require('./config/database');

const categoryRoutes = require('./routes/categoryRoutes');
const eventRoutes = require('./routes/eventRoutes');
const groupRoutes = require('./routes/groupRoutes');
const roomRoutes = require('./routes/roomRoutes');

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
    maxAge: 24 * 60 * 60 * 1000
}));

// app.use(function (req, res, next) {
//     if (req.session.userId) {
//         next();
//     } else {
//         res.status(401).send('Unauthorized');
//     }
// })

// Routes
app.use('/categories', categoryRoutes);
app.use('/events', eventRoutes);
app.use('/groups', groupRoutes);
app.use('/rooms', roomRoutes);

module.exports = app;
