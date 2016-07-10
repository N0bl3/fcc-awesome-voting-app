const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Poll = require('./poll').schema;

const userSchema = mongoose.Schema({
  username: String, password: String, polls: [Poll], hello: String,
});

userSchema.methods.generateHash =
  (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.validPassword = (submitted, expected) => bcrypt.compareSync(submitted, expected);

module.exports = mongoose.model('User', userSchema);
