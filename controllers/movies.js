const mongoose = require('mongoose');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
} = require('../constants/constants');

const AuthorizationError = require('../errors/authError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

const Movie = require('../models/movie');

// GET /movies
module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movies) => {
      res.status(SUCCESS_SUCCESS).send(movies);
    })
    .catch(next);
};

// POST /movies
module.exports.createFilm = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  // Добавление фильма в БД
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(SUCCESS_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Некорректные данные для создания фильма.'));
      }
      return next(error);
    });
};

// DELETE /movies/_id
module.exports.deleteFilm = (req, res, next) => {
  const userId = req.user._id;

  Movie.findById(req.params.id)
    .orFail()
    .then((movie) => {
      // Проверка на владельца фильма
      if (movie.owner.toString() !== userId) {
        throw new AuthorizationError('Вы не можете удалить этот фильм, так как вы не владелец его.');
      }
      return Movie.deleteOne(movie._id);
    })
    .then((deletedMovie) => res.status(SUCCESS_SUCCESS).send(deletedMovie))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Фильм не найден.'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Некорректные данные для удаления фильма.'));
      }
      return next(error);
    });
};
