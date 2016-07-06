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
  res.sendStatus(501);
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
