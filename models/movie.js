const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле страна обязательное к заполнению.'],
  },
  director: {
    type: String,
    required: [true, 'Поле режиссёр обязательное к заполнению.'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле продолжительность обязательное к заполнению.'],
  },
  year: {
    type: Number,
    required: [true, 'Поле год выпуска фильма обязательно к заполнению.'],
  },
  description: {
    type: String,
    required: [true, 'Поле описание фильма обязательно к заполению.'],
  },
  image: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
    required: [true, 'Поле ссылка на изображение обязательно к заполнению.'],
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
    required: [true, 'Поле трейлер фильма обязательно к заполнению.'],
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL.',
    },
    required: [true, 'Поле постера обязательно к заполнению.'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле пользователя, сохранившего фильм, обязательно к заполнению.'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле обязательно к заполнению.'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле название фильма обязательно к заполнению.'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле название фильма на английском обязательно к заполнению'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
