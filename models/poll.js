const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  name: String, choices: Array, votes: Array,
});

module.exports = mongoose.model('Poll', pollSchema);
