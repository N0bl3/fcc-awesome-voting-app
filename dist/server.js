'use strict';

/* eslint-disable no-unused-vars */
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug');
var debugServer = debug('server');
var debugDB = debug('database');
var debugRoute = debug('route');
var express = require('express');
var expressSession = require('express-session');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var request = require('request');
var routes = require('./routes/all');
/* eslint-enable no-unused-vars */

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(flash());
app.use(expressSession({
  secret: 'meow', name: 'fcc-awesome-voting', resave: true, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

require('./config/passport')(passport);

app.get('/', routes.index);

app.get('/login', routes.getLoginPage);

app.post('/login', passport.authenticate('login', {
  successRedirect: '/', failureRedirect: '/login', failureFlash: true
}));

app.get('/register', routes.getRegisterPage);

app.post('/register', passport.authenticate('register', {
  successRedirect: '/', failureRedirect: '/register', failureFlash: true
}));

app.get('/logout', function (req, res) {
  debugRoute('Logging Out');
  req.logout();
  res.redirect('/');
});

// Create
app.post('/poll', isLoggedIn, routes.createPoll);

//  Read
app.get('/poll/:pollID', routes.getPoll);

//  Update
app.post('/poll/:pollID', isLoggedIn, routes.updatePoll);
app.post('/poll/:pollID/vote', routes.votePoll);

// Delete
app.delete('/poll/:pollID', isLoggedIn, routes.deletePoll);

// Server operations
app.listen(app.get('port'), function () {
  debugServer('App starting on port ' + app.get('port'));
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting');
mongoose.connection.on('connected', function () {
  debugDB('Connection established to MongoDB');
});
mongoose.connection.on('error', function (err) {
  debugDB('Unable to connect to the mongoDB server. Error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  debugDB('Mongoose default connection disconnected');
});
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
