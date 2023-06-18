const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { JWT_SECRET } = process.env;

// Получение модели
const User = require('../models/user');

const {
  SUCCESS_SUCCESS,
  SUCCESS_CREATED,
} = require('../constants/constants');

const AuthorizationError = require('../errors/authError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const RequestError = require('../errors/requestError');

// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name,
    password,
    email,
  } = req.body;

  // Запись пользователя в БД
  bcrypt.hash(password, 15)
    .then((hash) => {
      User.create({
        name, password: hash, email,
      })
        .then(() => {
          res.status(SUCCESS_CREATED).send({
            name,
            email,
          });
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.ValidationError) {
            return next(new RequestError('Некорректные данные при создании пользователя.'));
          }
          if (error.code === 11000) {
            return next(new ConflictError('Пользователь с таким email уже существует.'));
          }
          return next(error);
        });
    }).catch(next);
};

// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthorizationError('Такого пользователя не существует. Проверьте логин или пароль.'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthorizationError('Неправильный логин или пароль.'));
          }
          const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'develop-secret', { expiresIn: '7d' });
          return res.status(SUCCESS_SUCCESS).send({ token });
        });
    })
    .catch(next);
};

// GET /users/me
module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(SUCCESS_SUCCESS).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователя не существует.'));
      }
      return next(error);
    });
};

// PATCH /users/me
module.exports.updateMyUserProfile = (req, res, next) => {
  const { name, email } = req.body || {};

  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      res.status(SUCCESS_SUCCESS).send(user);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь не существует.'));
      }
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new RequestError('Некорректные данные для обновления пользователя.'));
      }
      return next(error);
    });
};
