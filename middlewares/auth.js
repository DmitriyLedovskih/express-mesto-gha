const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(UnauthorizedError('Вы не авторизованы'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-key');
  } catch (err) {
    next(UnauthorizedError('Вы не авторизованы'));
  }

  req.user = payload;

  next();
};
