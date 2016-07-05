/* eslint-disable no-unused-vars */
const async = require('async');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debugServer = require('debug')('server');
const debugDB = require('debug')('database');
const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
app.use(expressSession());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

const User = mongoose.model('User', {
  username: String,
  password: String,
  email: String,
  gender: String,
  address: String,
});

function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}
function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
passport.use('login', new LocalStrategy({ passReqToCallback: true },
  (req, username, password, done) => {
    // check in mongo if a user with username exists or not
    User.findOne({ username },
      (err, user) => {
        // In case of any error, return using the done method
        if (err) {
          return done(err);
        }
        // Username does not exist, log error & redirect back
        if (!user) {
          console.log(`User Not Found with username${username}`);
          return done(null, false,
            req.flash('message', 'User Not found.'));
        }
        // User exists but wrong password, log the error
        if (!isValidPassword(user, password)) {
          console.log('Invalid Password');
          return done(null, false,
            req.flash('message', 'Invalid Password'));
        }
        // User and password both match, return user from
        // done method which will be treated like success
        return done(null, user);
      }
    );
  }));

passport.use('signup', new LocalStrategy({ passReqToCallback: true },
  (req, username, password, done) => {
    function findOrCreateUser() {
      // find a user in Mongo with provided username
      User.findOne({ username }, (err, user) => {
        // In case of any error return
        if (err) {
          console.log(`Error in SignUp: ${err}`);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          return done(null, false,
            req.flash('message', 'User Already Exists'));
        } else {
          // if there is no user with that email
          // create the user
          const newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // save the user
          newUser.save((err) => {
            if (err) {
              console.log(`Error in Saving user: ${err}`);
              throw err;
            }
            console.log('User Registration succesful');
            return done(null, newUser);
          });
        }
      });
    };

    // Delay the execution of findOrCreateUser and execute
    // the method in the next tick of the event loop
    process.nextTick(findOrCreateUser);
  })
);

app.get('/', routes.index);

app.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Create
app.post('/poll/:pollID', routes.createPoll);
app.post('/poll/:pollID/option/:option', routes.createPollOption);

//  Read
app.get('/poll/:pollID', routes.getPoll);
app.get('/user/:userID/polls', routes.listUserPolls);

//  Update
app.get('/poll/:pollID', routes.sharePoll);
app.get('/poll/:pollID/vote/:vote', routes.votePoll);

// Delete
app.delete('/poll/:pollID', routes.deletePoll);
app.delete('/poll/:pollID/option/:option', routes.deletePollOption);

// Server operations
app.listen(app.get('port'), () => {
  debugServer(`App starting on port ${app.get('port')}`);
});

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, (err, db) => {
    if (err) {
      debugDB(`Unable to connect to the mongoDB server. Error: ${err}`);
    } else {
      debugDB('Connection established to MongoDB');
      db.close();
    }
  });
}
