var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require('cookie-session');

var usersRouter = require('./routes/users');

var app = express();

function authRequired(req, res, next) {
    // Permettre le passage si la route est `/login`
    if (req.path == '/users/login' || req.path == '/users/register' || req.session.userId) {
        next();
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: ["keySession"],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 //24h
  }))
app.use(authRequired);
app.use('/users', usersRouter);

module.exports = app;
