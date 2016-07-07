const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  name: String, choices: [String], votes: [Number],
});

module.exports = {
  model: mongoose.model('Poll', pollSchema),
  schema: pollSchema,
};
