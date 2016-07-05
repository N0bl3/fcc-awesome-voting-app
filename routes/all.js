exports.index = (req, res) => {
  res.render('index');
};
//  Authenticate
exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.authenticate = (req, res) => {
  res.sendStatus(501);
};

exports.getRegisterPage = (req, res) => {
  res.sendStatus(501);
};

exports.register = (req, res) => {
  res.sendStatus(501);
};
//  Create
exports.createPoll = (req, res) => {
  res.sendStatus(501);
};

exports.createPollOption = (req, res) => {
  res.sendStatus(501);
};

//  Read
exports.getPoll = (req, res) => {
  res.sendStatus(501);
};

exports.listUserPolls = (req, res) => {
  res.sendStatus(501);
};

//  Update
exports.sharePoll = (req, res) => {
  res.sendStatus(501);
};

exports.votePoll = (req, res) => {
  res.sendStatus(501);
};

//  Delete
exports.deletePoll = (req, res) => {
  res.sendStatus(501);
};

exports.deletePollOption = (req, res) => {
  res.sendStatus(501);
};
