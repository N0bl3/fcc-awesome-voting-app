'use strict';

var User = require('../models/user');
var Poll = require('../models/poll').model;

exports.index = function (req, res) {
  res.render('index', {
    message: req.flash('message'), user: req.user
  });
};
//  Authenticate
exports.getLoginPage = function (req, res) {
  res.render('login', {
    message: req.flash('message')
  });
};

exports.authenticate = function (req, res) {
  res.sendStatus(501);
};

exports.getRegisterPage = function (req, res) {
  res.render('register', {
    message: req.flash('message')
  });
};

exports.register = function (req, res) {
  res.sendStatus(501);
};
//  Create
exports.createPoll = function (req, res) {
  var query = { username: req.user.username };
  var poll = new Poll();
  var pollID = poll._id;
  poll.name = 'Blue or pink?';
  poll.choices = ['Blue', 'Pink'];
  poll.votes = [0, 0];

  User.findOneAndUpdate(query, { $push: { polls: poll } }, { new: true }, function (err, user) {
    if (err) {
      res.sendStatus(500);
    } else if (!user) {
      res.sendStatus(404);
    } else {
      res.status(201).end(String(user.polls.id(pollID)._id));
    }
  });
};

//  Read
exports.getPoll = function (req, res) {
  var pollID = req.params.pollID;
  User.findOne({
    'polls._id': pollID
  }, function (err, user) {
    if (err) {
      res.sendStatus(500);
    } else if (!user) {
      res.sendStatus(404);
    } else {
      console.log(user.username, req.user.username);
      res.render('poll', {
        user: req.user,
        poll: user.polls.id(pollID),
        isAuthor: req.user ? user.username === req.user.username : false
      });
    }
  });
};

//  Update
exports.updatePoll = function (req, res) {
  var pollID = req.params.pollID;
  var data = req.body;

  User.findOne({ 'polls._id': pollID }, function (err, user) {
    if (err) {
      res.sendStatus(500);
    } else {
      (function () {
        var pollIndex = user.polls.findIndex(function (poll) {
          return String(poll._id) === pollID;
        });
        var target = user.polls[pollIndex];
        var choices = Object.keys(data).filter(function (query) {
          return (/^choice-[0-9]+$/.test(query)
          );
        }).map(function (query) {
          return data[query];
        }).filter(function (value) {
          return value;
        });
        target.name = data.name;
        target.choices = choices;
        target.votes.push(0);

        user.save(function (err, user) {
          if (err) {
            res.sendStatus(500);
          } else {
            console.log(user.polls[pollIndex]);
            res.sendStatus(200);
          }
        });
      })();
    }
  });
};

exports.sharePoll = function (req, res) {
  res.sendStatus(501);
};

exports.votePoll = function (req, res) {
  var pollID = req.params.pollID;
  var vote = req.body.vote;

  var voter = req.user ? req.user.username : req.ip;

  User.findOne({ 'polls._id': pollID }, function (err, user) {
    if (err) {
      res.sendStatus(500);
    } else {
      (function () {
        var pollIndex = user.polls.findIndex(function (poll) {
          return String(poll._id) === pollID;
        });
        var target = user.polls[pollIndex];
        var voters = target.voters;
        var votersArray = target.voters.toObject();
        if (!votersArray.some(function (value) {
          return value === voter;
        })) {
          target.votes.set(vote, target.votes[vote] ? target.votes[vote] + 1 : 1);

          voters.push(voter);

          user.save(function (err, user) {
            if (err) {
              res.sendStatus(500);
            } else {
              console.log(user.polls[pollIndex]);
              res.sendStatus(200);
            }
          });
        } else {
          res.sendStatus(403);
        }
      })();
    }
  });
};

//  Delete
exports.deletePoll = function (req, res) {
  var pollID = req.params.pollID;
  User.findOneAndUpdate({ 'polls._id': pollID }, { $pull: { polls: { _id: pollID } } }, function (err) {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

exports.deletePollOption = function (req, res) {
  res.sendStatus(501);
};