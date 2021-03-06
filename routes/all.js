const User = require('../models/user');
const Poll = require('../models/poll').model;

exports.index = (req, res) => {
  res.render('index', {
    message: req.flash('message'), user: req.user,
  });
};
//  Authenticate
exports.getLoginPage = (req, res) => {
  res.render('login', {
    message: req.flash('message'),
  });
};

exports.authenticate = (req, res) => {
  res.sendStatus(501);
};

exports.getRegisterPage = (req, res) => {
  res.render('register', {
    message: req.flash('message'),
  });
};

exports.register = (req, res) => {
  res.sendStatus(501);
};
//  Create
exports.createPoll = (req, res) => {
  const query = { username: req.user.username };
  const poll = new Poll();
  const pollID = poll._id;
  poll.name = 'Blue or pink?';
  poll.choices = ['Blue', 'Pink'];
  poll.votes = [0, 0];

  User.findOneAndUpdate(query, { $push: { polls: poll } }, { new: true }, (err, user) => {
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
exports.getPoll = (req, res) => {
  const pollID = req.params.pollID;
  User.findOne({
    'polls._id': pollID,
  }, (err, user) => {
    if (err) {
      res.sendStatus(500);
    } else if (!user) {
      res.sendStatus(404);
    } else {
      const isAuthor = req.user ? user.username === req.user.username : false;

      res.render('poll', {
        user: req.user, poll: user.polls.id(pollID), isAuthor,
      });
    }
  });
};

//  Update
exports.updatePoll = (req, res) => {
  const pollID = req.params.pollID;
  const data = req.body;

  User.findOne({ 'polls._id': pollID }, (err, user) => {
    if (err) {
      res.sendStatus(500);
    } else {
      const pollIndex = user.polls.findIndex((poll) => String(poll._id) === pollID);
      const target = user.polls[pollIndex];
      const choices = Object.keys(data).filter((query) => /^choice-[0-9]+$/.test(query))
        .map((query) => data[query])
        .filter((value) => value);
      target.name = data.name;
      target.choices = choices;
      target.votes.push(0);

      user.save((err, user) => {
        if (err) {
          res.sendStatus(500);
        } else {
          console.log(user.polls[pollIndex]);
          res.sendStatus(200);
        }
      });
    }
  });
};

exports.sharePoll = (req, res) => {
  res.sendStatus(501);
};

exports.votePoll = (req, res) => {
  const { pollID } = req.params;
  const { vote } = req.body;
  const voter = req.user ? req.user.username : req.ip;

  User.findOne({ 'polls._id': pollID }, (err, user) => {
    if (err) {
      res.sendStatus(500);
    } else {
      const pollIndex = user.polls.findIndex((poll) => String(poll._id) === pollID);
      const target = user.polls[pollIndex];
      const voters = target.voters;
      const votersArray = target.voters.toObject();
      if (!votersArray.some((value) => value === voter)) {
        target.votes.set(vote, target.votes[vote] ? target.votes[vote] + 1 : 1);

        voters.push(voter);

        user.save((err, user) => {
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
    }
  });
};

//  Delete
exports.deletePoll = (req, res) => {
  const pollID = req.params.pollID;
  User.findOneAndUpdate({ 'polls._id': pollID }, { $pull: { polls: { _id: pollID } } }, (err) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

exports.deletePollOption = (req, res) => {
  res.sendStatus(501);
};
