const { celebrate, Joi } = require('celebrate');

const patternOfLink = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const createUserJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    name: Joi.string().min(2).max(30),
  }),
});

const loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});

const getUserByIdJoi = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

const updateUserProfileJoi = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateCreateFilm = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(patternOfLink),
    trailerLink: Joi.string().required().pattern(patternOfLink),
    thumbnail: Joi.string().required().pattern(patternOfLink),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  createUserJoi,
  loginJoi,
  getUserByIdJoi,
  updateUserProfileJoi,
  validateCreateFilm,
};
