const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const Poll = require('../models/poll');

module.exports = function (passport) {
  // used to serialize the user for the session
  passport.serializeUser((user,
    done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser((id,
    done) => {
    User.findById(id, (err,
      user) => {
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({ passReqToCallback: true }, (req,
    username,
    password,
    done) => {
    // check in mongo if a user with username exists or not
    User.findOne({ username }, (err,
      user) => {
      // In case of any error, return using the done method
      if (err) {
        return done(err);
      }
      // Username does not exist, log error & redirect back
      if (!user) {
        return done(null, false, req.flash('message', 'User Not found.'));
      }
      console.log(user);
      // User exists bug password, log the error
      if (!user.validPassword(password, user.password)) {
        return done(null, false, req.flash('message', 'Invalid Password'));
      }
      // User and password both match, return user from
      // done method which will be treated like success
      return done(null, user);
    });
  }));

  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
  }, (req,
    username,
    password,
    done) => {
    process.nextTick(() => {
      User.findOne({ username }, (err,
        user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, false, req.flash('message', 'That username is already taken.'));
        }
        const newUser = new User();

        newUser.username = username;
        newUser.password = newUser.generateHash(password);

        const poll = new Poll.model();
        poll.name = 'New poll';
        poll.choices = ['Blues', 'Reds'];
        poll.votes = [0, 0];

        newUser.polls.push(poll);

        newUser.save((err,
          user) => {
          if (err) {
            console.log(err);
            throw err;
          }
          console.log(user);
          return done(null, newUser);
        });
      });
    });
  }));
};
