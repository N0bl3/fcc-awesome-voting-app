const Poll = require('../models/poll');

exports.index = (req,
  res) => {
  res.render('index', {
    message: req.flash('message'), user: req.user,
  });
};
//  Authenticate
exports.getLoginPage = (req,
  res) => {
  res.render('login', {
    message: req.flash('message'),
  });
};

exports.authenticate = (req,
  res) => {
  res.sendStatus(501);
};

exports.getRegisterPage = (req,
  res) => {
  res.render('register', {
    message: req.flash('message'),
  });
};

exports.register = (req,
  res) => {
  res.sendStatus(501);
};
//  Create
exports.createPoll = (req,
  res) => {
  const poll = new Poll();
  poll.name = 'New poll';
  poll.choices = ['Blue', 'Pink'];
  poll.votes = [50, 50];
  poll.save((err,
    poll) => {
    if (err) { res.sendStatus(500); }
    res.render('poll', poll);
  });
};

exports.createPollOption = (req,
  res) => {
  res.sendStatus(501);
};

//  Read
exports.getPoll = (req,
  res) => {
  res.sendStatus(501);
};

exports.listUserPolls = (req,
  res) => {
  res.render('pollsList');
};

//  Update
exports.sharePoll = (req,
  res) => {
  res.sendStatus(501);
};

exports.votePoll = (req,
  res) => {
  res.sendStatus(501);
};

//  Delete
exports.deletePoll = (req,
  res) => {
  res.sendStatus(501);
};

exports.deletePollOption = (req,
  res) => {
  res.sendStatus(501);
};
