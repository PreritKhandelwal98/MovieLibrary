const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    Title: String,
    Genre: String,
    imdbRating: String,
    Runtime: String,
    Released: String,
    Plot: String,
    Poster: String,
});

const listSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    movies: [movieSchema], // Array of movies
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const List = mongoose.model('List', listSchema);

module.exports = List;
