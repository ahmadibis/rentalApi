const mongoose = require('mongoose')
const {genreSchema} = require("./genre");
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true , trim: true},
  genre: {type:genreSchema, required: true},
  numberInStock: { type: Number, required: true },
  dailyRentalRate: { type: Number, required: true },
});

const Movies = mongoose.model('Movies', movieSchema)

function validateMovies(movie) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(40).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(100).required(),
        dailyRentalRate: Joi.number().min(0).max(100).required()
    })

    const result = schema.validate(movie)
    return result;
}

exports.Movies = Movies
exports.validate = validateMovies


