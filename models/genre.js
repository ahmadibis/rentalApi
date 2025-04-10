/** @format */

const Joi = require('joi');
const { default: mongoose } = require('mongoose');


const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  const result = schema.validate(genre);
  return result;
}

exports.Genre = Genre
exports.genreSchema = genreSchema
exports.validate = validateGenre
