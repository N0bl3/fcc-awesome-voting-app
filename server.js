/* eslint-disable no-unused-vars */
const async = require('async');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug');
const debugServer = debug('server');
const debugDB = debug('database');
const debugRoute = debug('route');
const express = require('express');
const expressSession = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const request = require('request');
const routes = require('./routes/all');
/* eslint-enable no-unused-vars */

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(flash());
app.use(expressSession({
  secret: 'meow', name: 'fcc-awesome-voting', resave: true, saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

function isLoggedIn(req,
  res,
  next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

require('./config/passport')(passport);

app.get('/', routes.index);

app.get('/login', routes.getLoginPage);

app.post('/login', passport.authenticate('login', {
  successRedirect: '/', failureRedirect: '/login', failureFlash: true,
}));

app.get('/register', routes.getRegisterPage);

app.post('/register', passport.authenticate('register', {
  successRedirect: '/', failureRedirect: '/register', failureFlash: true,
}));

app.get('/logout', (req,
  res) => {
  debugRoute('Logging Out');
  req.logout();
  res.redirect('/');
});

// Create
app.post('/poll', isLoggedIn, routes.createPoll);
app.post('/poll/:pollID/option/:option', isLoggedIn, routes.createPollOption);

//  Read
app.get('/poll/:pollID', routes.getPoll);

//  Update
app.put('/poll/:pollID', routes.updatePoll);
app.get('/poll/:pollID/share', routes.sharePoll);
app.patch('/poll/:pollID/vote/:vote', routes.votePoll);

// Delete
app.delete('/poll/:pollID', isLoggedIn, routes.deletePoll);
app.delete('/poll/:pollID/option/:option', isLoggedIn, routes.deletePollOption);

// Server operations
app.listen(app.get('port'), () => {
  debugServer(`App starting on port ${app.get('port')}`);
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting');
mongoose.connection.on('connected', () => {
  debugDB('Connection established to MongoDB');
});
mongoose.connection.on('error', (err) => {
  debugDB(`Unable to connect to the mongoDB server. Error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
  debugDB('Mongoose default connection disconnected');
});
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
