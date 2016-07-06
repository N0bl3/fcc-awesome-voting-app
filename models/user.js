const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username: String, password: String,
});

userSchema.methods.generateHash =
  (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

userSchema.methods.validPassword = (submitted, expected) => bcrypt.compareSync(submitted, expected);

module.exports = mongoose.model('User', userSchema);
