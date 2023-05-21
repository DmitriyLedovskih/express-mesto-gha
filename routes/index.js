const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { regex } = require('../utils/constants');
const { createUser, login, signOut } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.get('/signout', auth, signOut);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('URL не найден'));
});

module.exports = router;
