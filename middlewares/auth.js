const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError('Вы не авторизованы');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-key');
  } catch (err) {
    next(new UnauthorizedError('Вы не авторизованы'));
  }

  req.user = payload;

  next();
};
