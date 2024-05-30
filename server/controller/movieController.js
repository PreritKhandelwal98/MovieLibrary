const Movie = require('../models/MovieModel');
const { post } = require('../routes');

const addMovie = async (req, res) => {
    const { Title, Genre, imdbRating, Runtime, Released, Plot, Poster } = req.body;
    const movie = new Movie({
        Title,
        Genre,
        imdbRating,
        Runtime,
        Released,
        Plot,
        Poster,
        user: req.user._id,
    });

    const createdMovie = await movie.save();
    res.status(201).json(createdMovie);
};

const getMovies = async (req, res) => {
    const movies = await Movie.find({ user: req.user._id });
    res.json(movies);
};

module.exports = { addMovie, getMovies };
