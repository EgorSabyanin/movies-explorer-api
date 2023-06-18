const jwt = require('jsonwebtoken');

const AuthorizationError = require('../errors/authError');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Авторизируйтесь!'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'develop-secret');
  } catch (error) {
    return next(new AuthorizationError('Авторизируйтесь!'));
  }

  req.user = payload;
  return next();
};
